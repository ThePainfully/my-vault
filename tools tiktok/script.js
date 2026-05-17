// المتغيرات
const MASTER_PASSWORD_KEY = 'vault_master_pwd';
const ACCOUNTS_DATA_KEY = 'vault_accounts';

// عناصر DOM
const loginScreen = document.getElementById('login-screen');
const vaultScreen = document.getElementById('vault-screen');
const loginBtn = document.getElementById('login-btn');
const masterPwdInput = document.getElementById('master-password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const accountsList = document.getElementById('accounts-list');
const addModal = document.getElementById('add-modal');
const addNewBtn = document.getElementById('add-new-btn');
const closeModalBtn = document.querySelector('.close-modal');
const saveAccountBtn = document.getElementById('save-account-btn');

// الحقول
const siteNameInput = document.getElementById('site-name');
const usernameInput = document.getElementById('account-username');
const passwordInput = document.getElementById('account-password');
const togglePwdBtn = document.querySelector('.toggle-pwd-btn');

// تهيئة كلمة المرور الرئيسية أول مرة (للتجربة، يمكنك تغييره)
// إذا لم يكن هناك كلمة سر، اجعلها 1234
if (!localStorage.getItem(MASTER_PASSWORD_KEY)) {
    localStorage.setItem(MASTER_PASSWORD_KEY, '1234');
}

// 1. نظام تسجيل الدخول
loginBtn.addEventListener('click', handleLogin);
masterPwdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
    const enteredPwd = masterPwdInput.value;
    const correctPwd = localStorage.getItem(MASTER_PASSWORD_KEY);
    
    // إذا كانت أول مرة يدخل (إذا أردنا أن يضع كلمة السر الخاصة به أول مرة)
    if (correctPwd === '1234' && enteredPwd !== '1234' && enteredPwd.length > 0) {
        // يمكننا تفعيل خيار تعيين كلمة السر هنا، لكن حالياً الكلمة الافتراضية 1234
    }

    if (enteredPwd === correctPwd) {
        loginScreen.classList.remove('active');
        vaultScreen.classList.add('active');
        masterPwdInput.value = '';
        loginError.innerText = '';
        renderAccounts();
    } else {
        loginError.innerText = 'كلمة المرور خاطئة!';
    }
}

// تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    vaultScreen.classList.remove('active');
    loginScreen.classList.add('active');
});

// 2. إدارة المودال (النافذة المنبثقة)
addNewBtn.addEventListener('click', () => {
    addModal.classList.add('show');
});

closeModalBtn.addEventListener('click', () => {
    addModal.classList.remove('show');
    clearInputs();
});

// إظهار/إخفاء كلمة المرور في النموذج
togglePwdBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePwdBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// 3. حفظ الحسابات وعرضها
saveAccountBtn.addEventListener('click', () => {
    const site = siteNameInput.value.trim();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!site || !user || !pass) {
        alert('الرجاء تعبئة جميع الحقول');
        return;
    }

    const newAccount = {
        id: Date.now().toString(),
        site,
        user,
        pass
    };

    const accounts = getAccounts();
    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_DATA_KEY, JSON.stringify(accounts));

    addModal.classList.remove('show');
    clearInputs();
    renderAccounts();
});

function getAccounts() {
    const data = localStorage.getItem(ACCOUNTS_DATA_KEY);
    return data ? JSON.parse(data) : [];
}

function clearInputs() {
    siteNameInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    passwordInput.setAttribute('type', 'password');
    togglePwdBtn.innerHTML = '<i class="fas fa-eye"></i>';
}

function renderAccounts() {
    const accounts = getAccounts();
    accountsList.innerHTML = '';

    if (accounts.length === 0) {
        accountsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>لا يوجد حسابات محفوظة حتى الآن.</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">اضغط على الزر + للإضافة</p>
            </div>
        `;
        return;
    }

    accounts.forEach(acc => {
        // جلب أول حرف من اسم الموقع للأيقونة
        const firstLetter = acc.site.charAt(0).toUpperCase();

        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="site-title">
                    <div class="site-icon">${firstLetter}</div>
                    ${acc.site}
                </div>
                <button class="delete-btn" onclick="deleteAccount('${acc.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="detail-row">
                <div>
                    <div class="detail-label">اليوزر / الإيميل</div>
                    <div class="detail-value">
                        <span>${acc.user}</span>
                        <button class="copy-btn" onclick="copyText('${acc.user}')"><i class="fas fa-copy"></i></button>
                    </div>
                </div>
            </div>
            
            <div class="detail-row">
                <div style="width: 100%;">
                    <div class="detail-label">كلمة المرور</div>
                    <div class="detail-value">
                        <span type="password" class="pwd-field">••••••••</span>
                        <div>
                            <button class="copy-btn" onclick="revealPwd(this, '${acc.pass}')"><i class="fas fa-eye"></i></button>
                            <button class="copy-btn" onclick="copyText('${acc.pass}')"><i class="fas fa-copy"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        accountsList.appendChild(card);
    });
}

// دوال مساعدة للحسابات (يجب أن تكون Global)
window.deleteAccount = function(id) {
    if(confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
        let accounts = getAccounts();
        accounts = accounts.filter(acc => acc.id !== id);
        localStorage.setItem(ACCOUNTS_DATA_KEY, JSON.stringify(accounts));
        renderAccounts();
    }
}

window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        // إظهار رسالة بسيطة
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--primary);color:white;padding:10px 20px;border-radius:20px;z-index:999;font-size:0.9rem;';
        toast.innerText = 'تم النسخ بنجاح!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
}

window.revealPwd = function(btn, realPwd) {
    const span = btn.parentElement.parentElement.querySelector('.pwd-field');
    const icon = btn.querySelector('i');
    
    if (span.innerText === '••••••••') {
        span.innerText = realPwd;
        icon.className = 'fas fa-eye-slash';
    } else {
        span.innerText = '••••••••';
        icon.className = 'fas fa-eye';
    }
}
