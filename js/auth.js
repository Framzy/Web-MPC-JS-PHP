let user_id = 0;

// Login Section
document.getElementById("loginButton").addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir default
    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    console.log("Login button clicked with username:", usernameValue); // Debugging
    loginAkun(usernameValue, passwordValue);
});

const usernameAkun = document.getElementById("idUsernameAkun");
const errorLoginInfo = document.getElementById("idErrorLoginInfo");

function loginAkun(username, password) {
    if (username.trim() === "" || password.trim() === "") {
        errorLoginInfo.innerHTML = "Username dan password harus diisi";
        errorLoginInfo.style.display = "block";
        return;
    }

    fetch('auth.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data); // Debugging
            if (data.success) {
                errorLoginInfo.style.display = "none";
                document.getElementById("idPopupContainer").style.display = "none";

                document.getElementById("idPopupLoginInfoBerhasil").style.display = "flex";
                setTimeout(() => {
                    document.getElementById("idPopupLoginInfoBerhasil").style.display = "none";
                    loginPopup.style.display = 'none';
                    window.location.reload();
                }, 1500);              

            } else if (data.error === 'Invalid password.') {
                errorLoginInfo.innerHTML = "Password salah"
                errorLoginInfo.style.display = "block";
            }else if (data.error === 'Invalid username or password.') {
                errorLoginInfo.innerHTML = "Username atau password salah"
                errorLoginInfo.style.display = "block";
            } 
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', function () {
    // Mengubah tipe input
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Mengubah ikon
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});

// Akhir Login


// Regist Section
document.getElementById("registButton").addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir default
    const newUsernameValue = document.getElementById("newUsername").value;
    const newPasswordValue = document.getElementById("newPassword").value;
    const newRePasswordValue = document.getElementById("newRePassword").value;
    console.log("Login button clicked with newUsername:", newUsernameValue); // Debugging
    registAkun(newUsernameValue, newPasswordValue, newRePasswordValue);
});

const infoErrorNewUsername = document.getElementById("idErrorNewUsername");
const infoErrorNewPassword = document.getElementById("idErrorNewPassword");

function registAkun(newUsername, newPassword, newRePassword) {
    if (newUsername.trim() === ""){
        infoErrorNewUsername.innerHTML = "Username harus diisi";
        infoErrorNewUsername.style.display = "block";
        return;
    }else if (newPassword.trim() === ""){
        infoErrorNewPassword.innerHTML = "password harus diisi";
        infoErrorNewPassword.style.display = "block";
        return;
    }else if(newRePassword.trim() === "") {
        infoErrorNewPassword.innerHTML = "re-password harus diisi";
        infoErrorNewPassword.style.display = "block";
        return;
    } else {
        infoErrorNewUsername.style.display = "none";
        infoErrorNewPassword.style.display = "none";
    }

    if (newUsername.length < 5) {
        infoErrorNewUsername.innerHTML = "minimal 5 karakter";
        infoErrorNewUsername.style.display = "block";
        return;
    }else{
        infoErrorNewUsername.style.display = "none";
    }

    if (newPassword.length < 8) {
        infoErrorNewPassword.innerHTML = "minimal 8 karakter";
        infoErrorNewPassword.style.display = "block";
        return;
    } else if (newPassword !== newRePassword) {
        infoErrorNewPassword.innerHTML = "re-password harus sama";
        infoErrorNewPassword.style.display = "block";
        return;
    } else{
        infoErrorNewPassword.style.display = "none";
    }

    fetch('regist.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newUsername: newUsername,
            newPassword: newPassword
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data);
            if (data.success) {
                document.getElementById('idPopupContainer').style.display = 'none';
                infoErrorNewUsername.style.display = "none";
                infoErrorNewPassword.style.display = "none";

                document.getElementById("idPopupRegistInfoBerhasil").style.display = "flex";
                setTimeout(() => {
                    document.getElementById("idPopupRegistInfoBerhasil").style.display = "none";
                    document.getElementById('registPopupContent').style.display = 'none';
                    document.getElementById('idPopupContainer').style.display = 'flex';
                    document.getElementById('loginPopupContent').style.display = 'flex';
                }, 1500);
            } else if (data.error === 'Username already exists.') {
                infoErrorNewUsername.style.display = "block";
            } else {
                console.error("Registration failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Akhir Regist

// Change Update
document.getElementById("changeButton").addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir default
    const changeOldPassValue = document.getElementById("changeOldPassword").value;
    const changePassValue = document.getElementById("changePassword").value;
    const changeRePassValue = document.getElementById("changeRePassword").value;
    console.log("ganti password");
    
    changePassword(changeOldPassValue, changePassValue, changeRePassValue);
});

const infoErrorChangeOldPassword = document.getElementById("idErrorChangeOldPassword");
const infoErrorChangePassword = document.getElementById("idErrorChangePassword");

function changePassword(changeOldPassValue, changePassValue, changeRePassValue) {
    if (changeOldPassValue.trim() === ""){
        infoErrorChangeOldPassword.innerHTML = "Password lama harus diisi";
        infoErrorChangeOldPassword.style.display = "block";
        return;
    } else {
        infoErrorChangeOldPassword.style.display = "none";
    }
    
    if (changePassValue.trim() === ""){
        infoErrorChangePassword.innerHTML = "Password baru harus diisi";
        infoErrorChangePassword.style.display = "block";
        return;
    }else if(changeRePassValue.trim() === "") {
        infoErrorChangePassword.innerHTML = "re-password harus diisi";
        infoErrorChangePassword.style.display = "block";
        return;
    } else {
        infoErrorChangePassword.style.display = "none";
    }

    if (changePassValue.length < 8) {
        infoErrorChangePassword.innerHTML = "minimal 8 karakter";
        infoErrorChangePassword.style.display = "block";
        return;
    } else if (changePassValue !== changeRePassValue) {
        infoErrorChangePassword.innerHTML = "re-password harus sama";
        infoErrorChangePassword.style.display = "block";
        return;
    } else{
        infoErrorChangePassword.style.display = "none";
    }

    const idInfoChangePassword = document.getElementById("idInfoChangePassword");
    const payload ={
        password: changeOldPassValue,
        newPassword: changePassValue
    }
    fetch('changeUpdate.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data);
            if (data.success) {
                document.getElementById("changeOldPassword").value = "";
                document.getElementById("changePassword").value = "";
                document.getElementById("changeRePassword").value = "";

                idInfoChangePassword.innerHTML="Password berhasil diubah";
                idInfoChangePassword.style.color="#248610";
                idInfoChangePassword.style.display="block";

                setTimeout(() => {
                    idInfoChangePassword.style.display="none";              
                }, 4000);
            } else if (data.error === 'Current password is incorrect.') {
                idInfoChangePassword.innerHTML="Password lama salah";
                idInfoChangePassword.style.display = "block";
            } else {
                console.error("Registration failed. Please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Akhir Change


document.getElementById("buttonLogout").addEventListener("click", function () {
    forLogoutAkun();
});

function forLogoutAkun() {
    fetch('logout.php', {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data:", data); // Debugging
            if (data.isLoggedOut) {
                console.log("Logout successful, showing alert..."); // Debugging
                document.getElementById("idPopupLogoutContent").style.display = "none";
                document.getElementById("idPopupLogoutInfoBerhasil").style.display = "flex";
                setTimeout(() => {
                    document.getElementById("idPopupLogoutInfoBerhasil").style.display = "none";
                    updatePopupLogout();
                    window.location.reload();
                }, 1500);
            } else {
                alert("login gagal");
                window.location.reload();
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function isLoggedIn() {
    fetch('login_check.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response data isLoggedIn:", data); // Debugging
            user_id = data.user_id;
            checkSavePage(data);
            if (data.isLoggedIn) {
                updatePopupLoggedIn(data);
            } else {
                updatePopupLogout();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

