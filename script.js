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
          document.getElementById('form-section').classList.add('hidden');
          document.getElementById('success-view').classList.add('hidden');
          document.getElementById('login-section').classList.remove('hidden');
          const form = document.getElementById('admissionForm');
          if(form) form.reset();
          document.getElementById('online-payment-section').classList.remove('hidden');
          // Reset file names too
          const fileSpans = document.querySelectorAll('.file-name-display');
          fileSpans.forEach(span => span.textContent = 'No file chosen');
          
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
                if(display) display.textContent = "No file chosen";
            } else {
                // Update text to show filename
                if(display) display.textContent = fileInput.files[0].name;
            }
        } else {
            // User opened dialog but clicked Cancel (reset text)
            if(display) display.textContent = "No file chosen";
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
          if(this.value !== "") selects.forEach(other => { if(other !== this) other.value = ""; });
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

// --- INTERACTIVE FIELD COLOR LOGIC ---
document.addEventListener("DOMContentLoaded", function() {
    const inputs = document.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='number'], textarea, select");

    inputs.forEach(input => {
        // 1. WHEN USER LEAVES THE FIELD (BLUR)
        input.addEventListener("blur", function() {
            if (this.value.trim() !== "") {
                this.classList.add("filled-input"); 
            } else {
                this.classList.remove("filled-input"); 
            }
        });

        // 2. WHEN USER CLICKS BACK INTO THE FIELD (FOCUS)
        input.addEventListener("focus", function() {
            this.classList.remove("filled-input"); 
        });
    });
});

