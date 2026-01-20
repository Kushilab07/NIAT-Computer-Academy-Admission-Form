import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
      import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

      const firebaseConfig = {
        apiKey: "AIzaSyCWpp7vH0FAubDAW1Gvw5LMmtEqfMIq4u0",
        authDomain: "niat-admission-form.firebaseapp.com",
        projectId: "niat-admission-form",
        storageBucket: "niat-admission-form.firebasestorage.app",
        messagingSenderId: "907218345703",
        appId: "1:907218345703:web:57e6dd3d74baab2f190c42",
        measurementId: "G-YPCVGYS7L9"
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      const loginBtn = document.getElementById('google-login-btn');
      const logoutBtnTop = document.getElementById('logout-btn-top');
      const logoutBtnBottom = document.getElementById('logout-btn-bottom');

      if(loginBtn) {
        loginBtn.addEventListener('click', () => {
          signInWithPopup(auth, provider).catch((error) => { alert("Login Failed: " + error.message); });
        });
      }

            const handleLogout = () => {
        signOut(auth).then(() => {
          // 1. Hide Views
          document.getElementById('form-section').classList.add('hidden');
          document.getElementById('success-view').classList.add('hidden');
          document.getElementById('login-section').classList.remove('hidden');
          
          // 2. Reset Form Data
          const form = document.getElementById('admissionForm');
          if(form) form.reset();
          
          // 3. THIS IS THE NEW PART: Remove the blue color from all fields
          const filledInputs = document.querySelectorAll('.filled-input');
          filledInputs.forEach(input => input.classList.remove('filled-input'));

          // 4. Reset Payment & Button States
          document.getElementById('online-payment-section').classList.remove('hidden');
          
          // Reset file names text
          const fileSpans = document.querySelectorAll('.file-name-display');
          fileSpans.forEach(span => span.textContent = 'No file added);
          
          const btn = document.getElementById('submit-btn');
          if(btn) {
              btn.classList.remove('loading', 'success');
              btn.disabled = false;
          }
        }).catch((error) => {
          alert("Error signing out: " + error.message);
        });
      };


      if(logoutBtnTop) logoutBtnTop.addEventListener('click', handleLogout);
      if(logoutBtnBottom) logoutBtnBottom.addEventListener('click', handleLogout);

      onAuthStateChanged(auth, (user) => {
        if (user) {
          document.getElementById('login-section').classList.add('hidden');
          if(document.getElementById('success-view').classList.contains('hidden')){
             document.getElementById('form-section').classList.remove('hidden');
          }
          const emailF = document.getElementById('email-field');
          const nameF = document.getElementById('user-display-name');
          if(emailF) emailF.value = user.email;
          if(nameF) nameF.innerText = user.displayName;
        } else {
          document.getElementById('login-section').classList.remove('hidden');
          document.getElementById('form-section').classList.add('hidden');
        }
      });

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby2PI0qFO1Hho0_x3srib57bQdZ0OVPGw09t0Qw0piZ0Bla367-gJuTdiZkTpIiHYwH/exec"; 
      const MAX_SIZE = 1 * 1024 * 1024; // 1MB Limit

            function checkFileSize(fileInput) {
        const displayId = fileInput.id + "-name";
        const display = document.getElementById(displayId);

        if(fileInput.files.length > 0) {
            if(fileInput.files[0].size > MAX_SIZE) {
                alert("File is too big! Max size is 1MB.");
                fileInput.value = ""; 
                if(display) display.textContent = "No file added";
            } else {
                // Update text to show filename
                if(display) display.textContent = fileInput.files[0].name;
            }
        } else {
            // User opened dialog but clicked Cancel (reset text)
            if(display) display.textContent = "No file added";
        }
            }

      
      const photoF = document.getElementById('photoFile');
      const docF = document.getElementById('docFile');
      const payF = document.getElementById('payFile');

      if(photoF) photoF.addEventListener('change', function() { checkFileSize(this) });
      if(docF) docF.addEventListener('change', function() { checkFileSize(this) });
      if(payF) payF.addEventListener('change', function() { checkFileSize(this) });

      // --- PAYMENT MODE TOGGLE ---
      const payRadios = document.querySelectorAll('input[name="payMode"]');
      const onlineSection = document.getElementById('online-payment-section');
      
      payRadios.forEach(radio => {
          radio.addEventListener('change', function() {
              if(this.value === 'Online') {
                  onlineSection.classList.remove('hidden');
              } else {
                  onlineSection.classList.add('hidden');
              }
          });
      });

      const selects = document.querySelectorAll('.course-select');
selects.forEach(select => {
  select.addEventListener('change', function() {
    if(this.value !== "") {
        selects.forEach(other => { 
            // OPEN BRACE START
            if(other !== this) { 
                other.value = ""; 
                other.classList.remove('filled-input'); 
            } 
            // CLOSE BRACE END
        });
    }
  });
});


      // --- SUBMIT LOGIC ---
      const form = document.getElementById('admissionForm');
      if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
                            // --- NEW VALIDATION: Check Photo & Doc ---
            if(document.getElementById('photoFile').files.length === 0) {
                alert("Please upload your Passport Photo.");
                return; // Stop submission
            }
            if(document.getElementById('docFile').files.length === 0) {
                alert("Please upload your Qualification Document.");
                return; // Stop submission
            }
            
            const payMode = document.querySelector('input[name="payMode"]:checked').value;
            
            if (payMode === 'Online') {
                const payFile = document.getElementById('payFile');
                if(payFile.files.length === 0) {
                    alert("Please upload the Payment Screenshot.");
                    return;
                }
            }

            var btn = document.getElementById('submit-btn');
            if(btn) {
                btn.disabled = true; 
                btn.classList.add('loading'); 
            }

            const filePromises = [
                getFileData('photoFile'), 
                getFileData('docFile'), 
                (payMode === 'Online') ? getFileData('payFile') : Promise.resolve({data:"", name:""})
            ];

            Promise.all(filePromises).then(files => {
                var formData = {
                    studentName: document.getElementsByName('studentName')[0].value,
                    fatherName: document.getElementsByName('fatherName')[0].value,
                    email: document.getElementById('email-field').value, 
                    contact: document.getElementsByName('contact')[0].value,
                    village: document.getElementsByName('village')[0].value,
                    po: document.getElementsByName('po')[0].value,
                    district: document.getElementsByName('district')[0].value,
                    pin: document.getElementsByName('pin')[0].value,
                    qualification: document.getElementsByName('qualification')[0].value,
                    activity: document.getElementsByName('activity')[0].value,
                    course3m: document.getElementsByName('course3m')[0].value,
                    course6m: document.getElementsByName('course6m')[0].value,
                    course1y: document.getElementsByName('course1y')[0].value,
                    courseSp: document.getElementsByName('courseSp')[0].value,
                    notes: document.getElementsByName('notes')[0].value, 
                    paymentMode: payMode, 
                    
                    photoData: files[0].data, photoName: files[0].name,
                    docData: files[1].data, docName: files[1].name,
                    payData: files[2].data, payName: files[2].name
                };

                const serialDisplay = document.getElementById('serial-display');
                if(serialDisplay) serialDisplay.innerHTML = '<div class="serial-loader"></div>';

                // --- START UPLOAD ---
                const uploadTask = fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                }).then(response => response.json());

                // --- START ANIMATION TIMER (2 Seconds) ---
                const timerTask = new Promise(resolve => setTimeout(resolve, 2000));

                timerTask.then(() => {
                    // STOP SPINNING, SHOW GREEN CHECK
                    if(btn) {
                        btn.classList.remove('loading');
                        btn.classList.add('success'); 
                    }

                    // WAIT 1 SECOND (To let user see the Green Check)
                    setTimeout(() => {
                        // NOW SWITCH PAGE
                        document.getElementById('form-section').classList.add('hidden');
                        document.getElementById('success-view').classList.remove('hidden');
                        
                        // HANDLE SERVER RESPONSE
                        uploadTask.then(data => {
                            if(data.status === 'success') {
                                if(serialDisplay) serialDisplay.textContent = data.serial;
                            } else {
                                handleError("Submission Failed: " + data.message);
                            }
                        }).catch(error => {
                            handleError("Network Error: " + error);
                        });
                    }, 1000); 
                });
            });
          });
      }

      function handleError(msg) {
        alert(msg);
        document.getElementById('success-view').classList.add('hidden');
        document.getElementById('form-section').classList.remove('hidden');
        var btn = document.getElementById('submit-btn');
        if(btn) {
            btn.disabled = false; 
            btn.classList.remove('loading');
            btn.classList.remove('success'); 
        }
      }

      function getFileData(id) {
        return new Promise(resolve => {
            var el = document.getElementById(id);
            if(!el || !el.files[0]) resolve({data:null, name:null});
            else {
                var file = el.files[0];
                var reader = new FileReader();
                reader.onload = e => resolve({data:e.target.result, name:file.name});
                reader.readAsDataURL(file);
            }
        });
      }

// --- IMPROVED INTERACTIVE FIELD COLOR LOGIC ---
document.addEventListener("DOMContentLoaded", function() {
    // Select all inputs, textareas, AND select dropdowns
    const inputs = document.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='number'], textarea, select");

    inputs.forEach(input => {
        
        // 1. HELPER FUNCTION: Updates color based on value
        const updateColor = () => {
             if (input.value.trim() !== "") {
                input.classList.add("filled-input"); 
            } else {
                input.classList.remove("filled-input"); 
            }
        };

        // 2. WHEN USER LEAVES THE FIELD (BLUR) -> Standard for text boxes
        input.addEventListener("blur", updateColor);

        // 3. WHEN USER SELECTS AN OPTION (CHANGE) -> Specific fix for Dropdowns
        if(input.tagName === "SELECT") {
            input.addEventListener("change", updateColor);
        }

        // 4. WHEN USER CLICKS BACK INTO THE FIELD (FOCUS) -> Turn normal for editing
        input.addEventListener("focus", function() {
            this.classList.remove("filled-input"); 
        });
    });
});


// --- DISABLE RIGHT-CLICK & INSPECT SHORTCUTS ---
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Disables right-click menu
});

document.addEventListener('keydown', function(event) {
    // Disable F12
    if (event.key === "F12") {
        event.preventDefault();
    }
    
    // Disable Ctrl+Shift+I (Inspect)
    if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
    }

    // Disable Ctrl+Shift+J (Console)
    if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
    }

    // Disable Ctrl+U (View Source)
    if (event.ctrlKey && event.key === "u") {
        event.preventDefault();
    }
});
