// public/js/app.js - Main Application State & Router for JanSahayak AI
import { api } from './api.js';
import { renderNavbar } from './components/Navbar.js';
import { renderHero } from './components/Hero.js';
import { renderAssistant } from './components/Assistant.js';
import { renderCitizenProfile } from './components/CitizenProfile.js';
import { renderSchemeCards } from './components/SchemeCards.js';
import { renderSchemeModal } from './components/SchemeModal.js';
import { renderHowItWorks } from './components/HowItWorks.js';
import { renderAbout } from './components/About.js';
import { renderSettingsModal } from './components/SettingsModal.js';

class JanSahayakApp {
  constructor() {
    this.state = {
      currentTab: 'home',
      userProfile: {
        state: 'Karnataka', // Default friendly starter
        age: 22,
        occupation: 'Student'
      },
      chatMessages: [],
      isSearching: false,
      liveAgentStatus: null,
      latestAdvice: null,
      schemesList: [],
      resultsFilter: { status: 'All', category: 'All', state: 'All' },
      activeModalScheme: null,
      isSettingsOpen: false,
      health: null,
      followUpQuestions: []
    };

    this.mountPoints = {
      navbar: document.getElementById('navbar-root'),
      main: document.getElementById('main-content-root'),
      modal: document.getElementById('modal-root'),
      settings: document.getElementById('settings-root')
    };

    this.init();
  }

  async init() {
    // 1. Fetch Backend Health & Config
    await this.refreshHealth();

    // 2. Fetch Initial Verified Schemes
    try {
      const data = await api.fetchSchemes();
      if (data && data.schemes) {
        this.state.schemesList = data.schemes;
      }
    } catch (err) {
      console.warn('Initial scheme load notice:', err.message);
    }

    // 3. Render Initial View
    this.render();
  }

  async refreshHealth() {
    try {
      this.state.health = await api.getHealthStatus();
    } catch (err) {
      console.error('Failed to fetch health status:', err);
    }
  }

  setTab(tab) {
    this.state.currentTab = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  /**
   * Main Research Query Handler (handles both Hero & Assistant inputs)
   */
  async handleSearch(query) {
    if (!query || this.state.isSearching) return;

    // Switch to Assistant tab
    this.state.currentTab = 'assistant';
    this.state.isSearching = true;
    this.state.liveAgentStatus = {
      step: 1,
      title: 'Initializing Autonomous Agent',
      message: 'Extracting citizen parameters and scanning official portals...'
    };

    // Append user message to chat
    this.state.chatMessages.push({
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    });

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Use SSE Streaming for real-time live browser progress
    let receivedComplete = false;

    const stopStream = api.streamResearch({
      query,
      userProfile: this.state.userProfile,
      onEvent: (eventType, eventData) => {
        if (eventType === 'PROFILE_EXTRACTED') {
          if (eventData.profile) {
            this.state.userProfile = { ...this.state.userProfile, ...eventData.profile };
          }
        } else if (eventType === 'AGENT_STATUS' || eventType === 'AGENT_PROGRESS') {
          this.state.liveAgentStatus = {
            step: eventData.step || 2,
            title: eventData.status || 'TinyFish Web Agent',
            message: eventData.message,
            streamingUrl: eventData.streamingUrl
          };
        }
        this.render();
      },
      onComplete: (advice) => {
        receivedComplete = true;
        this.state.isSearching = false;
        this.state.liveAgentStatus = null;
        this.state.latestAdvice = advice;
        this.state.schemesList = advice.schemes || [];
        this.state.followUpQuestions = advice.followUpQuestions || [];

        // Append bot reply
        this.state.chatMessages.push({
          role: 'bot',
          content: advice.assistantMessage,
          schemes: advice.schemes,
          disclaimer: advice.disclaimer,
          summaryCounts: advice.summaryCounts,
          timestamp: new Date().toISOString()
        });

        this.render();
      },
      onError: async (err) => {
        if (receivedComplete) return;
        console.warn('SSE stream notice, falling back to sync API:', err.message);

        // Fallback to synchronous endpoint
        try {
          const advice = await api.submitResearchSync({
            query,
            userProfile: this.state.userProfile
          });

          this.state.isSearching = false;
          this.state.liveAgentStatus = null;
          this.state.latestAdvice = advice;
          this.state.schemesList = advice.schemes || [];
          this.state.followUpQuestions = advice.followUpQuestions || [];

          this.state.chatMessages.push({
            role: 'bot',
            content: advice.assistantMessage,
            schemes: advice.schemes,
            disclaimer: advice.disclaimer,
            summaryCounts: advice.summaryCounts,
            timestamp: new Date().toISOString()
          });
        } catch (syncErr) {
          this.state.isSearching = false;
          this.state.liveAgentStatus = null;
          this.state.chatMessages.push({
            role: 'bot',
            content: `I encountered an issue connecting to the research agent: ${syncErr.message}. You can still browse our verified government repository below.`,
            timestamp: new Date().toISOString()
          });
        }
        this.render();
      }
    });
  }

  handleFollowUpOption(optionText) {
    this.handleSearch(optionText);
  }

  handleProfileChange(newProfile) {
    this.state.userProfile = newProfile;
    
    // Perform active search based on chosen profile pill so buttons perform real actions
    if (newProfile.occupation) {
      this.handleSearch(`Verified government schemes and financial aid for ${newProfile.occupation} in ${newProfile.state || 'Karnataka'}`);
    } else if (newProfile.state) {
      this.handleSearch(`Government schemes and subsidies for residents of ${newProfile.state}`);
    } else {
      this.render();
    }
  }

  openSchemeDetails(schemeId) {
    const found = this.state.schemesList.find(s => s.id === schemeId);
    if (found) {
      this.state.activeModalScheme = found;
      this.render();
    }
  }

  closeSchemeDetails() {
    this.state.activeModalScheme = null;
    this.render();
  }

  openSettings() {
    this.state.isSettingsOpen = true;
    this.render();
  }

  closeSettings() {
    this.state.isSettingsOpen = false;
    this.render();
  }

  render() {
    // 1. Render Navbar
    renderNavbar(
      this.mountPoints.navbar,
      this.state,
      (tab) => this.setTab(tab),
      () => this.openSettings()
    );

    // 2. Render Main Content based on currentTab
    this.mountPoints.main.innerHTML = '';
    const container = document.createElement('div');
    this.mountPoints.main.appendChild(container);

    if (this.state.currentTab === 'home') {
      renderHero(
        container,
        this.state,
        (q) => this.handleSearch(q),
        (id) => this.openSchemeDetails(id)
      );

      // Also render Featured Schemes section on Home with dynamic in-place filtering
      const featuredDiv = document.createElement('div');
      container.appendChild(featuredDiv);
      renderSchemeCards(
        featuredDiv,
        this.state.schemesList,
        this.state,
        (filter) => {
          this.state.resultsFilter = filter;
          this.render();
        },
        (id) => this.openSchemeDetails(id)
      );

      // Render How it Works preview on Home
      const howDiv = document.createElement('div');
      container.appendChild(howDiv);
      renderHowItWorks(howDiv, () => this.setTab('assistant'));

    } else if (this.state.currentTab === 'assistant') {
      renderAssistant(
        container,
        this.state,
        (msg) => this.handleSearch(msg),
        (opt) => this.handleFollowUpOption(opt),
        (id) => this.openSchemeDetails(id)
      );

      // Mount citizen profile card inside assistant
      const profileMount = container.querySelector('#assistant-profile-mount');
      if (profileMount) {
        renderCitizenProfile(
          profileMount,
          this.state.userProfile,
          (updated) => this.handleProfileChange(updated)
        );
      }

    } else if (this.state.currentTab === 'schemes') {
      renderSchemeCards(
        container,
        this.state.schemesList,
        this.state,
        (newFilter) => {
          this.state.resultsFilter = newFilter;
          this.render();
        },
        (id) => this.openSchemeDetails(id)
      );

    } else if (this.state.currentTab === 'how-it-works') {
      renderHowItWorks(container, () => this.setTab('assistant'));

    } else if (this.state.currentTab === 'about') {
      renderAbout(container);
    }

    // 3. Render Scheme Modal
    if (this.state.activeModalScheme) {
      renderSchemeModal(
        this.mountPoints.modal,
        this.state.activeModalScheme,
        this.state.userProfile,
        () => this.closeSchemeDetails()
      );
    } else {
      this.mountPoints.modal.innerHTML = '';
    }

    // 4. Render Settings Modal
    if (this.state.isSettingsOpen) {
      renderSettingsModal(
        this.mountPoints.settings,
        this.state.health,
        () => this.closeSettings(),
        async () => {
          await this.refreshHealth();
          this.render();
        }
      );
    } else {
      this.mountPoints.settings.innerHTML = '';
    }
  }
}

// Bootstrap JanSahayak AI App
window.addEventListener('DOMContentLoaded', () => {
  window.app = new JanSahayakApp();
});
