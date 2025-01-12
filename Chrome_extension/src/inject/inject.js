(function() {
	// Function to inject the command panel
	function injectPanel() {
	  // Prevent multiple injections
	  if (document.getElementById('agentic-ai-command-panel-host')) return;
	  
	  // Create the host for Shadow DOM
	  const shadowHost = document.createElement('div');
	  shadowHost.id = 'agentic-ai-command-panel-host';
	  shadowHost.style.position = 'fixed';
	  shadowHost.style.top = '0';
	  shadowHost.style.left = '0';
	  shadowHost.style.width = '100%';
	  shadowHost.style.height = '100%';
	  shadowHost.style.pointerEvents = 'none'; // Allow clicks to pass through when not interacting
	  shadowHost.style.zIndex = '9999'; // Ensure it's on top
	  document.body.appendChild(shadowHost);
	
	  // Attach Shadow DOM
	  const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
	
	  // Inject the styles
	  const style = document.createElement('style');
	  style.textContent = `
		/* Styles scoped within the Shadow DOM */
		.command-panel {
		  position: fixed;
		  top: 10%; /* Adjust to your liking */
		  left: 0;
		  height: 50px; /* Collapsed height */
		  background: rgba(255, 255, 255, 0.2);
		  backdrop-filter: blur(10px);
		  border-radius: 0 8px 8px 0;
		  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		  overflow: hidden;
		  width: 50px; /* Collapsed width */
		  cursor: pointer;
		  transition: width 0.3s ease, height 0.3s ease;
		  pointer-events: auto; /* Enable interactions */
		}
	
		/* Expanded state */
		.command-panel.expanded {
		  width: 90%; /* Expand width */
		  height: 250px; /* Expand height */
		  left: 5%; /* Pull away from the edge */
		}
	
		/* The clickable arrow/tab */
		.toggle-tab {
		  position: absolute;
		  top: 0;
		  left: 0;
		  height: 100%;
		  width: 50px; /* Same as collapsed width */
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  background: rgba(255, 255, 255, 0.3);
		  backdrop-filter: blur(10px);
		  border-radius: 0 8px 8px 0;
		  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
		  z-index: 2;
		}
	
		/* Steep arrow icon */
		.toggle-arrow {
		  font-size: 18px;
		  color: #333;
		  transform: rotate(0deg);
		  transition: transform 0.3s ease;
		}
	
		/* Rotate arrow on expand */
		.command-panel.expanded .toggle-arrow {
		  transform: rotate(180deg);
		}
	
		/* Inside content */
		.command-content {
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: center;
		  width: 100%;
		  height: 100%;
		  background: rgba(255, 255, 255, 0.2); /* Added background */
		  backdrop-filter: blur(10px); /* Added backdrop blur */
		  opacity: 0; /* Hidden when collapsed */
		  pointer-events: none;
		  transition: opacity 0.3s ease;
		}
	
		.command-panel.expanded .command-content {
		  opacity: 1;
		  pointer-events: auto;
		}
	
		/* Title */
		.command-title {
		  font-size: 20px;
		  color: #333;
		  margin-bottom: 15px;
		}
	
		/* Input field and button container */
		.command-input-container {
		  display: flex;
		  align-items: center;
		  width: 80%;
		}
	
		/* Command-line arrow for input */
		.command-icon {
		  margin-right: 10px;
		  font-size: 20px;
		  color: #fff; /* Match input box */
		}
	
		/* Input field */
		.command-input {
		  flex: 1;
		  padding: 10px;
		  border: none; /* Removed border */
		  border-radius: 5px;
		  outline: none;
		  font-size: 16px;
		  background: #fff; /* White background */
		  color: #333; /* Dark text */
		}
	
		.command-input::placeholder {
		  color: #aaa;
		}
	
		/* Run button */
		.run-button {
		  margin-left: 10px;
		  padding: 10px 20px;
		  background: rgba(255, 255, 255, 0.3);
		  border: none;
		  border-radius: 5px;
		  color: #333;
		  font-size: 16px;
		  font-weight: bold;
		  cursor: pointer;
		  backdrop-filter: blur(5px);
		  transition: background 0.3s ease, transform 0.2s ease;
		}
	
		.run-button:hover {
		  background: rgba(255, 255, 255, 0.5);
		  transform: scale(1.05);
		}
	
		.run-button:disabled {
		  background: rgba(255, 255, 255, 0.1);
		  cursor: not-allowed;
		  transform: scale(1);
		}
		
		/* Feedback message */
		.feedback-message {
		  margin-top: 10px;
		  font-size: 14px;
		  color: #333;
		}
	  `;
	  shadowRoot.appendChild(style);
	
	  // Inject the HTML structure
	  const panel = document.createElement('div');
	  panel.classList.add('command-panel');
	  panel.id = 'commandPanel';
	
	  panel.innerHTML = `
		<div class="toggle-tab" id="toggleTab" role="button" aria-expanded="false" aria-label="Toggle Command Panel">
		  <span class="toggle-arrow">❱</span>
		</div>
		<div class="command-content">
		  <div class="command-title">Agentic AI Command</div>
		  <div class="command-input-container">
			<span class="command-icon">❱</span>
			<input
			  type="text"
			  class="command-input"
			  id="commandInput"
			  placeholder="From this page, I would like to..."
			/>
			<button class="run-button" id="runButton">Run</button>
		  </div>
		  <div class="feedback-message" id="feedbackMessage"></div>
		</div>
	  `;
	
	  shadowRoot.appendChild(panel);
	
	  // Bind event listeners
	  const toggleTab = shadowRoot.getElementById('toggleTab');
	  const runButton = shadowRoot.getElementById('runButton');
	  const commandInput = shadowRoot.getElementById('commandInput');
	  const feedbackMessage = shadowRoot.getElementById('feedbackMessage');
	
	  // Toggle expand/collapse
	  toggleTab.addEventListener('click', (e) => {
		e.stopPropagation(); // Prevent event bubbling
		const isExpanded = panel.classList.toggle('expanded');
		toggleTab.setAttribute('aria-expanded', isExpanded);
		if (isExpanded) {
		  commandInput.focus(); // Automatically focus input
		}
	  });
	
	  // Close panel when clicking outside
	  document.addEventListener('click', (e) => {
		if (!shadowHost.contains(e.target)) {
		  panel.classList.remove('expanded');
		  toggleTab.setAttribute('aria-expanded', 'false');
		}
	  });
	
	  // Prevent closing when interacting with the panel content
	  panel.addEventListener('click', (e) => e.stopPropagation());
	
	  // Handle "Run" button click
	  runButton.addEventListener('click', async () => {
		const task = commandInput.value.trim();
		if (!task) {
		  alert('Please enter a task.');
		  return;
		}
	
		// Disable the button and change its text to "Running"
		runButton.disabled = true;
		runButton.textContent = 'Running...';
		feedbackMessage.textContent = 'Submitting your task...';
	
		try {
		  // Construct the task with context
		  const taskWithContext = `Please start from this site ${window.location.href} and do this: ${task}`;
	
		  // Send the task to the FastAPI server via POST request
		  const response = await fetch('http://localhost:8888/run', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			  // If using API keys or authentication, include them here
			  // 'x-api-key': 'your-api-key'
			},
			body: JSON.stringify({ task: taskWithContext })
		  });
	
		  if (!response.ok) {
			throw new Error(`Server responded with status ${response.status}`);
		  }
	
		  const data = await response.json();
		  console.log('Task submitted:', data);
	
		  // Update feedback message
		  feedbackMessage.textContent = 'Task is being processed.';
	
		} catch (error) {
		  console.error('Error submitting task:', error);
		  feedbackMessage.textContent = 'Failed to submit the task. Please try again.';
		} finally {
		  // Re-enable the button and reset its text after 15 seconds
		  setTimeout(() => {
			runButton.disabled = false;
			runButton.textContent = 'Run';
			feedbackMessage.textContent = '';
		  }, 15000);
		}
	  });
	
	  // Handle Enter key for the input field
	  commandInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
		  runButton.click();
		}
	  });
	}
	
	// Function to inject the panel when document.body is available
	function waitForBodyAndInject() {
	  if (document.body) {
		injectPanel();
	  } else {
		const observer = new MutationObserver((mutations, obs) => {
		  if (document.body) {
			injectPanel();
			obs.disconnect();
		  }
		});
		observer.observe(document.documentElement, { childList: true, subtree: true });
	  }
	}
	
	// Inject the panel
	waitForBodyAndInject();
  })();
  