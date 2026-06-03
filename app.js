// 更新同步状态显示
function updateSyncStatus(status, message) {
    const syncIcon = document.getElementById('syncIcon');
    const syncText = document.getElementById('syncText');
    const syncStatus = document.getElementById('syncStatus');
    
    if (!syncIcon || !syncText || !syncStatus) return;
    
    switch(status) {
        case 'local':
            syncIcon.textContent = '💾';
            syncText.textContent = '本地模式 · 双击"启动服务器.bat"开启协同';
            syncStatus.style.background = '#fff3cd';
            syncStatus.style.color = '#856404';
            syncStatus.style.cursor = 'pointer';
            syncStatus.title = '点击查看如何启用多人协同';
            syncStatus.onclick = () => {
                alert('📝 启用多人协同的步骤：\n\n1. 关闭此网页\n2. 双击"启动服务器.bat"文件\n3. 在浏览器中打开显示的地址\n\n同事也可以通过你的电脑IP访问！');
            };
            break;
        case 'connecting':
            syncIcon.textContent = '🔄';
            syncText.textContent = message || '正在连接...';
            syncStatus.style.background = '#f0f0f0';
            syncStatus.style.cursor = 'default';
            syncStatus.onclick = null;
            break;
        case 'connected':
            syncIcon.textContent = '✅';
            syncText.textContent = message || '已连接 · 多人协同';
            syncStatus.style.background = '#d4edda';
            syncStatus.style.color = '#155724';
            syncStatus.style.cursor = 'default';
            syncStatus.onclick = null;
            break;
        case 'syncing':
            syncIcon.textContent = '⬆️';
            syncText.textContent = message || '正在同步...';
            syncStatus.style.background = '#fff3cd';
            syncStatus.style.cursor = 'default';
            syncStatus.onclick = null;
            break;
        case 'synced':
            syncIcon.textContent = '✅';
            syncText.textContent = message || '已同步';
            syncStatus.style.background = '#d4edda';
            syncStatus.style.color = '#155724';
            syncStatus.style.cursor = 'default';
            syncStatus.onclick = null;
            setTimeout(() => {
                updateSyncStatus('connected', '已连接 · 多人协同');
            }, 2000);
            break;
        case 'error':
            syncIcon.textContent = '⚠️';
            syncText.textContent = message || '连接失败 · 仅本地';
            syncStatus.style.background = '#f8d7da';
            syncStatus.style.color = '#721c24';
            syncStatus.style.cursor = 'default';
            syncStatus.onclick = null;
            break;
    }
}

// ========== Firebase 配置和初始化 ==========
// Firebase 功能可选：通过 HTTP 访问时自动启用，file:// 协议时使用本地存储
let firebaseEnabled = false;
let database = null;
let dataRef = null;

// 检测是否通过 HTTP 访问
if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    // 通过 HTTP 访问，启用 Firebase
    console.log('🌐 检测到 HTTPS/HTTP 协议，准备启用 Firebase...');
    
    try {
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK 未加载');
        }
        
        const firebaseConfig = {
            apiKey: "AIzaSyB5zN9eVQGRqfvK3oGNEh23QuOMnbQRTSY",
            authDomain: "aoao-39647.firebaseapp.com",
            databaseURL: "https://aoao-39647-default-rtdb.firebaseio.com",
            projectId: "aoao-39647",
            storageBucket: "aoao-39647.firebasestorage.app",
            messagingSenderId: "590332138066",
            appId: "1:590332138066:web:d7938057f5edf53f91458b"
        };
        
        console.log('🔧 正在初始化 Firebase...');
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        dataRef = database.ref('hsCodeData');
        firebaseEnabled = true;
        console.log('✅ Firebase 初始化成功（多人协同模式已启用）');
    } catch (error) {
        console.error('❌ Firebase 初始化失败:', error);
        console.error('错误详情:', error.message);
        firebaseEnabled = false;
    }
} else {
    // 直接打开文件，使用本地存储
    console.log('📁 本地文件模式 - 使用本地存储');
    firebaseEnabled = false;
}

// ========== 密码保护功能 ==========
const CORRECT_PASSWORD = "1140";

// 页面加载时检查密码状态
document.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('authenticated');
    
    if (isAuthenticated === 'true') {
        // 已验证，隐藏密码层
        document.getElementById('passwordOverlay').classList.add('hidden');
        initializeApp();
    } else {
        // 未验证，显示密码层并设置事件
        setupPasswordValidation();
    }
});

function setupPasswordValidation() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordError = document.getElementById('passwordError');

    // 回车键提交
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });

    // 按钮点击提交
    passwordSubmit.addEventListener('click', validatePassword);

    function validatePassword() {
        const inputPassword = passwordInput.value;
        
        if (inputPassword === CORRECT_PASSWORD) {
            // 密码正确
            sessionStorage.setItem('authenticated', 'true');
            document.getElementById('passwordOverlay').classList.add('hidden');
            passwordInput.classList.remove('error');
            passwordError.classList.remove('show');
            initializeApp();
        } else {
            // 密码错误
            passwordInput.classList.add('error');
            passwordError.textContent = '密码错误，请重试';
            passwordError.classList.add('show');
            passwordInput.value = '';
            
            // 0.4秒后移除错误样式
            setTimeout(() => {
                passwordInput.classList.remove('error');
            }, 400);
        }
    }

    // 输入时清除错误提示
    passwordInput.addEventListener('input', function() {
        passwordError.classList.remove('show');
    });
}

// 主应用初始化函数
function initializeApp() {
    // 调用原有的初始化逻辑
    loadData(); // Firebase 会在内部处理渲染
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// ========== 数据和主要功能 ==========

// 初始数据 - 完整200+条数据
const initialData = [{"类别":"机械/电子电器","中英品名":"水泵；Water pump；调料泵/泵；Spice pumps；pump；车载气泵/泵；Car Air Pump；饮水机/水泵；Drinking fountain","材质/用途判断":"用途/关键词：机械器具","HS6":"8413.82","10位申报":"8413.82.00.00","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8413.82 归类；合并自4条同HS记录","id":1,"order":0},{"类别":"机械/电子电器","中英品名":"手持/台式风扇 / table floor wall fans","材质/用途判断":"家具/家居","HS6":"8414.51","10位申报":"8414.51.90.90","B3 Duty / MFN":"Free","口径":"风扇整机","id":2,"order":1},{"类别":"机械/电子电器","中英品名":"其他风机 / other fans blowers","材质/用途判断":"机械器具","HS6":"8414.59","10位申报":"8414.59.00.90","B3 Duty / MFN":"Free","口径":"风机整机","id":3,"order":2},{"类别":"机械/电子电器","中英品名":"风扇/风机零件 / fan parts","材质/用途判断":"机械器具","HS6":"8414.90","10位申报":"8414.90.90.90","B3 Duty / MFN":"Free","口径":"零件","id":4,"order":3},{"类别":"机械/电子电器","中英品名":"水管过滤器 / Water pipe filter","材质/用途判断":"机械器具","HS6":"8421.21","10位申报":"8421.21.00.00","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8421.21 归类","id":5,"order":4},{"类别":"机械/电子电器","中英品名":"汽车滤清器 / filter for car","材质/用途判断":"机械器具","HS6":"8421.31","10位申报":"8421.31.00.20","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8421.31 归类","id":6,"order":5},{"类别":"机械/电子电器","中英品名":"过滤器 / filtering apparatus","材质/用途判断":"机械器具","HS6":"8421.39","10位申报":"8421.39.00.90","B3 Duty / MFN":"Free","口径":"过滤净化","id":7,"order":6},{"类别":"机械/电子电器","中英品名":"过滤器 / Filter","材质/用途判断":"机械器具","HS6":"8421.99","10位申报":"8421.99.00.10","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8421.99 归类","id":8,"order":7},{"类别":"机械/电子电器","中英品名":"烟斗滤网套 / Tobacco Pipes screen sleeve","材质/用途判断":"机械器具","HS6":"8421.99","10位申报":"8421.99.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8421.99 归类","id":9,"order":8},{"类别":"机械/电子电器","中英品名":"喷雾/喷洒器具 / sprayers spray guns","材质/用途判断":"机械/电子电器","HS6":"8424.20","10位申报":"8424.20.00.00","B3 Duty / MFN":"Free","口径":"喷射器具","id":10,"order":9},{"类别":"机械/电子电器","中英品名":"喷雾器 / Sprayer","材质/用途判断":"机械器具","HS6":"8424.41","10位申报":"8424.41.00.00","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8424.41 归类","id":11,"order":10},{"类别":"机械/电子电器","中英品名":"其他喷洒机械 / other spraying appliances","材质/用途判断":"机械器具","HS6":"8424.89","10位申报":"8424.89.00.00","B3 Duty / MFN":"Free","口径":"机械喷洒","id":12,"order":11},{"类别":"机械/电子电器","中英品名":"高压清洗机喷嘴；Pressure Washer Nozzles；不锈钢喷嘴；Stainless steel nozzle","材质/用途判断":"材质：不锈钢；用途/关键词：机械器具","HS6":"8424.90","10位申报":"8424.90.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8424.90 归类；合并自2条同HS记录；关联类别：机械/电子电器、钢铁/金属制品","id":13,"order":12},{"类别":"机械/电子电器","中英品名":"张紧器 / Tensioner","材质/用途判断":"机械器具","HS6":"8428.90","10位申报":"8428.90.00.00","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8428.90 归类","id":14,"order":13},{"类别":"机械/电子电器","中英品名":"打磨机 / sanding machine 打磨机","材质/用途判断":"机械器具","HS6":"8465.93","10位申报":"8465.93.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8465.93 归类","id":15,"order":14},{"类别":"机械/电子电器","中英品名":"吹叶机；Leaf Blower；电动/气动手提工具；power hand tools","材质/用途判断":"用途/关键词：机械器具、电子电器","HS6":"8467.29","10位申报":"8467.29.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8467.29 归类；手持动力工具；合并自2条同HS记录","id":16,"order":15},{"类别":"机械/电子电器","中英品名":"键盘鼠标输入输出 / computer input output units","材质/用途判断":"电子电器","HS6":"8471.60","10位申报":"8471.60.00.90","B3 Duty / MFN":"Free","口径":"电脑外设","id":17,"order":16},{"类别":"机械/电子电器","中英品名":"电脑零件 / computer parts accessories","材质/用途判断":"家具/家居","HS6":"8473.30","10位申报":"8473.30.90.00","B3 Duty / MFN":"Free","口径":"电脑专用零件","id":18,"order":17},{"类别":"机械/电子电器","中英品名":"阀门 / taps valves","材质/用途判断":"玩具/运动","HS6":"8481.80","10位申报":"8481.80.00.90","B3 Duty / MFN":"Free","口径":"管路控制","id":19,"order":18},{"类别":"机械/电子电器","中英品名":"牙科成型材料/垫 / Dental molding materials / molding materials","材质/用途判断":"机械器具","HS6":"8483.90","10位申报":"8483.90.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 8483.90 归类","id":20,"order":19},{"类别":"机械/电子电器","中英品名":"充电器/电源适配器 / chargers adapters","材质/用途判断":"电子电器","HS6":"8504.40","10位申报":"8504.40.90.90","B3 Duty / MFN":"Free","口径":"电源转换","id":21,"order":20},{"类别":"机械/电子电器","中英品名":"普通干电池 / primary batteries","材质/用途判断":"电子电器","HS6":"8506.10","10位申报":"8506.10.90.00","B3 Duty / MFN":"7%","口径":"原电池","id":22,"order":21},{"类别":"机械/电子电器","中英品名":"锂离子电池 / lithium-ion batteries","材质/用途判断":"电子电器","HS6":"8507.60","10位申报":"8507.60.90.00","B3 Duty / MFN":"7%","口径":"蓄电池","id":23,"order":22},{"类别":"机械/电子电器","中英品名":"吸尘器；Vacuum Cleaner；vacuum cleaners","材质/用途判断":"用途/关键词：电子电器、机械/电子电器","HS6":"8508.11","10位申报":"8508.11.00.00","B3 Duty / MFN":"8%","口径":"电子电器机械；按原始HS 8508.11 归类；吸尘整机；合并自2条同HS记录","id":24,"order":23},{"类别":"机械/电子电器","中英品名":"吸尘器 / Vacuum Cleaner","材质/用途判断":"电子电器","HS6":"8508.60","10位申报":"8508.60.00.00","B3 Duty / MFN":"7.5%","口径":"电子电器机械；按原始HS 8508.60 归类","id":25,"order":24},{"类别":"机械/电子电器","中英品名":"吸尘器；Vacuum Cleaner；吸尘器零件；vacuum cleaner parts","材质/用途判断":"用途/关键词：电子电器、机械/电子电器","HS6":"8508.70","10位申报":"8508.70.00.00","B3 Duty / MFN":"Free","口径":"电子电器机械；按原始HS 8508.70 归类；零件；合并自2条同HS记录","id":26,"order":25},{"类别":"机械/电子电器","中英品名":"烟雾机/便携雾化吸入器/香薰机/加湿器 / Smoking machine/Portable Nebulizer Inhaler/aroma diffuser / humidifier","材质/用途判断":"家具/家居","HS6":"8509.80","10位申报":"8509.80.90.90","B3 Duty / MFN":"Free","口径":"小家电；按原始HS 8509.80 归类","id":27,"order":26},{"类别":"机械/电子电器","中英品名":"汽车香薰补充芯/汽车香薰配件 / car air freshener refill / car air freshener parts","材质/用途判断":"电子电器","HS6":"8509.90","10位申报":"8509.90.90.00","B3 Duty / MFN":"3%","口径":"电子电器机械；按原始HS 8509.90 归类","id":28,"order":27},{"类别":"机械/电子电器","中英品名":"电动理发器 / hair clippers","材质/用途判断":"电子电器","HS6":"8510.20","10位申报":"8510.20.90.00","B3 Duty / MFN":"Free","口径":"电动剪","id":29,"order":28},{"类别":"机械/电子电器","中英品名":"水壶；kettle；电热水壶/热水器；electric water heaters kettles","材质/用途判断":"用途/关键词：电子电器","HS6":"8516.10","10位申报":"8516.10.90.90","B3 Duty / MFN":"6.5%","口径":"小家电；按原始HS 8516.10 归类；电热水；合并自2条同HS记录","id":30,"order":29},{"类别":"机械/电子电器","中英品名":"电烤箱/电炉/电饭锅 / electric ovens cookers","材质/用途判断":"电子电器","HS6":"8516.60","10位申报":"8516.60.90.10","B3 Duty / MFN":"8%","口径":"电热烹饪","id":31,"order":30},{"类别":"机械/电子电器","中英品名":"塑料耳塞清洁套装/电子清洁套装；Plastic earplug cleaning kit；Electronic cleaning kit；割草机工作头；Lawn mower working head；噪音检测仪/noise detecting machine；NOISE DETECTING INSTRUMENT；noise detecting machine；家用榨汁机/搅拌机/电动机器；Household juicer/blender；Electric Machine；家用甲醛检测仪/household detecting machine；Household formaldehyde detector；household detecting machine；测试仪/设备；Multimeters 1800W Solar Panel Tester Photovoltaic；Multimeters device；烧烤架；barbeque grill；电动缸/电动机器；Electric Cylinders；蔬菜切片器/面包切片器；Vegetable Slicer；bread slicer/Vegetable Slicer；超声波驱蚊器/便携驱蚊器；Ultrasonic mosquito repeller/portable mosquito repeller；酒精测试仪/测试仪；Breathalyzer；Tester","材质/用途判断":"材质：塑料；用途/关键词：电子电器、家具/家居、箱包","HS6":"8516.60","10位申报":"8516.60.90.90","B3 Duty / MFN":"8%","口径":"电子电器机械；按原始HS 8516.60 归类；小家电；合并自11条同HS记录；关联类别：塑料制品、机械/电子电器","id":32,"order":31},{"类别":"机械/电子电器","中英品名":"咖啡/茶机 / coffee tea makers","材质/用途判断":"机械器具","HS6":"8516.71","10位申报":"8516.71.10.00","B3 Duty / MFN":"9%","口径":"电热饮品","id":33,"order":32},{"类别":"机械/电子电器","中英品名":"其他电热器具；other electro-thermic appliances；取奶器/温奶器；取奶器/bottle warmer","材质/用途判断":"用途/关键词：电子电器","HS6":"8516.79","10位申报":"8516.79.90.00","B3 Duty / MFN":"6.5%","口径":"电热器具；小家电；按原始HS 8516.79 归类；合并自2条同HS记录","id":34,"order":33},{"类别":"机械/电子电器","中英品名":"对讲机 / Walkie Talkie","材质/用途判断":"电子电器","HS6":"8517.14","10位申报":"8517.14.00.00","B3 Duty / MFN":"Free","口径":"电子电器机械；按原始HS 8517.14 归类","id":35,"order":34},{"类别":"机械/电子电器","中英品名":"其他通信设备 / other telecom apparatus","材质/用途判断":"机械/电子电器","HS6":"8517.69","10位申报":"8517.69.00.90","B3 Duty / MFN":"Free","口径":"通信类","id":36,"order":35},{"类别":"机械/电子电器","中英品名":"麦克风 / microphones","材质/用途判断":"家具/家居","HS6":"8518.10","10位申报":"8518.10.00.00","B3 Duty / MFN":"Free","口径":"音频输入","id":37,"order":36},{"类别":"机械/电子电器","中英品名":"单喇叭音箱 / single loudspeakers","材质/用途判断":"机械/电子电器","HS6":"8518.21","10位申报":"8518.21.00.00","B3 Duty / MFN":"Free","口径":"音箱","id":38,"order":37},{"类别":"机械/电子电器","中英品名":"多喇叭音箱 / multiple loudspeakers","材质/用途判断":"机械/电子电器","HS6":"8518.22","10位申报":"8518.22.00.00","B3 Duty / MFN":"Free","口径":"音箱","id":39,"order":38},{"类别":"机械/电子电器","中英品名":"耳机 / headphones earphones","材质/用途判断":"机械器具","HS6":"8518.30","10位申报":"8518.30.90.10","B3 Duty / MFN":"Free","口径":"音频输出","id":40,"order":39},{"类别":"机械/电子电器","中英品名":"调音台 / sound console","材质/用途判断":"电子电器","HS6":"8518.50","10位申报":"8518.50.00.00","B3 Duty / MFN":"Free","口径":"电子音频；按原始HS 8518.50 归类","id":41,"order":40},{"类别":"机械/电子电器","中英品名":"车载多媒体播放器/Multimedia Player / Car Multimedia Player / Multimedia Player","材质/用途判断":"电子电器","HS6":"8519.89","10位申报":"8519.89.00.00","B3 Duty / MFN":"Free","口径":"电子音频；按原始HS 8519.89 归类","id":42,"order":41},{"类别":"机械/电子电器","中英品名":"CarPlay车载投屏设备；Carplay car screen sharing device；U盘/USB Flash Drive；USB flash disk/Flash drive/USB Flash Drive","材质/用途判断":"用途/关键词：电子电器","HS6":"8523.80","10位申报":"8523.80.00.00","B3 Duty / MFN":"Free","口径":"电子电器机械；按原始HS 8523.80 归类；合并自2条同HS记录","id":43,"order":42},{"类别":"机械/电子电器","中英品名":"倒车摄像头 / Rear view of the camera","材质/用途判断":"电子电器","HS6":"8525.89","10位申报":"8525.89.00.20","B3 Duty / MFN":"Free","口径":"影像显示；按原始HS 8525.89 归类","id":44,"order":43},{"类别":"机械/电子电器","中英品名":"摄像头/相机模块 / cameras","材质/用途判断":"电子电器","HS6":"8525.89","10位申报":"8525.89.00.90","B3 Duty / MFN":"Free","口径":"摄像设备","id":45,"order":44},{"类别":"机械/电子电器","中英品名":"显示器；Monitor；monitors","材质/用途判断":"用途/关键词：机械/电子电器、电子电器","HS6":"8528.52","10位申报":"8528.52.00.00","B3 Duty / MFN":"Free","口径":"影像显示；按原始HS 8528.52 归类；显示设备；合并自2条同HS记录","id":46,"order":45},{"类别":"机械/电子电器","中英品名":"家用安防报警器 / Home security alarm","材质/用途判断":"电子电器","HS6":"8531.10","10位申报":"8531.10.90.90","B3 Duty / MFN":"6.5%","口径":"电子电器机械；按原始HS 8531.10 归类","id":47,"order":46},{"类别":"机械/电子电器","中英品名":"开关 / electrical switches","材质/用途判断":"电子电器","HS6":"8536.50","10位申报":"8536.50.90.90","B3 Duty / MFN":"Free","口径":"电路开关","id":48,"order":47},{"类别":"机械/电子电器","中英品名":"插头插座 / plugs sockets","材质/用途判断":"机械/电子电器","HS6":"8536.69","10位申报":"8536.69.00.90","B3 Duty / MFN":"Free","口径":"电连接","id":49,"order":48},{"类别":"机械/电子电器","中英品名":"HDMI转接头 / HDMI adapter","材质/用途判断":"电子电器","HS6":"8536.69","10位申报":"8536.69.90.00","B3 Duty / MFN":"Free","口径":"电子电器机械；按原始HS 8536.69 归类","id":50,"order":49},{"类别":"机械/电子电器","中英品名":"带接头电缆 / electric cables with connectors","材质/用途判断":"电子电器","HS6":"8544.42","10位申报":"8544.42.00.90","B3 Duty / MFN":"Free","口径":"带接头线缆","id":51,"order":50},{"类别":"机械/电子电器","中英品名":"无接头电线电缆 / electric wires cables no connectors","材质/用途判断":"电子电器","HS6":"8544.49","10位申报":"8544.49.00.90","B3 Duty / MFN":"Free","口径":"绝缘线缆","id":52,"order":51},{"类别":"塑料制品","中英品名":"丙烯酸树脂 / acrylic polymers","材质/用途判断":"塑料；塑料制品","HS6":"3906.90","10位申报":"3906.90.00.90","B3 Duty / MFN":"Free","口径":"初级形态","id":53,"order":52},{"类别":"塑料制品","中英品名":"牙线/牙线棒/塑料线/塑料线材 / Dental floss/Dental floss stick / Plastic line/plastic wire","材质/用途判断":"塑料；医疗/护理","HS6":"3916.90","10位申报":"3916.90.00.00","B3 Duty / MFN":"Free","口径":"塑料制品；按原始HS 3916.90 归类","id":54,"order":53},{"类别":"塑料制品","中英品名":"软管接头 / Hose Connector","材质/用途判断":"塑料；塑料制品","HS6":"3917.40","10位申报":"3917.40.00.99","B3 Duty / MFN":"Free","口径":"塑料制品；按原始HS 3917.40 归类","id":55,"order":54},{"类别":"塑料制品","中英品名":"呼吸贴/运动胶带；Respiratory patch；sports tape；瘦身贴/Tape；Weight loss slim patch；Tape；皮革修补贴/tape；Leather repair patch；运动胶带；驼背矫正带/Tape；Hunchback correction strap","材质/用途判断":"材质：塑料、皮革/PU；用途/关键词：玩具/运动、塑料制品、医疗/护理","HS6":"3919.10","10位申报":"3919.10.20.00","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3919.10 归类；合并自5条同HS记录","id":56,"order":55},{"类别":"塑料制品","中英品名":"塑料胶带≤20cm / self-adhesive plastic tape","材质/用途判断":"塑料；塑料制品","HS6":"3919.10","10位申报":"3919.10.99.90","B3 Duty / MFN":"6.5%","口径":"自粘塑料带","id":57,"order":56},{"类别":"塑料制品","中英品名":"PE塑料膜片 / polyethylene film sheet","材质/用途判断":"塑料；塑料制品","HS6":"3920.10","10位申报":"3920.10.00.90","B3 Duty / MFN":"Free","口径":"按塑料种类","id":58,"order":57},{"类别":"塑料制品","中英品名":"PP塑料膜片 / polypropylene film sheet","材质/用途判断":"塑料；塑料制品","HS6":"3920.20","10位申报":"3920.20.00.90","B3 Duty / MFN":"Free","口径":"按塑料种类","id":59,"order":58},{"类别":"塑料制品","中英品名":"铝制品/塑料膜 / aluminum products / Plastic Film","材质/用途判断":"铝、塑料；塑料制品","HS6":"3920.99","10位申报":"3920.99.00.00","B3 Duty / MFN":"Free","口径":"塑料制品；按原始HS 3920.99 归类","id":60,"order":59},{"类别":"塑料制品","中英品名":"塑料卫生洁具 / plastic sanitary ware","材质/用途判断":"塑料；塑料制品","HS6":"3922.90","10位申报":"3922.90.00.00","B3 Duty / MFN":"6.5%","口径":"卫生洁具","id":61,"order":60},{"类别":"塑料制品","中英品名":"塑料箱盒周转箱 / plastic boxes cases crates","材质/用途判断":"塑料；箱包","HS6":"3923.10","10位申报":"3923.10.00.00","B3 Duty / MFN":"Free","口径":"包装/运输容器","id":62,"order":61},{"类别":"塑料制品","中英品名":"车载冰箱/收纳盒 / Car Refrigerator / Storage Box","材质/用途判断":"塑料；车辆配件","HS6":"3923.10","10位申报":"3923.10.00.90","B3 Duty / MFN":"Free","口径":"塑料制品；按原始HS 3923.10 归类","id":63,"order":62},{"类别":"塑料制品","中英品名":"PE塑料袋 / PE plastic sacks bags","材质/用途判断":"塑料；箱包","HS6":"3923.21","10位申报":"3923.21.90.90","B3 Duty / MFN":"6.5%","口径":"PE袋类","id":64,"order":63},{"类别":"塑料制品","中英品名":"其他塑料袋 / other plastic sacks bags","材质/用途判断":"塑料；箱包","HS6":"3923.29","10位申报":"3923.29.90.00","B3 Duty / MFN":"6.5%","口径":"其他塑料袋","id":65,"order":64},{"类别":"塑料制品","中英品名":"塑料瓶 / plastic bottles flasks","材质/用途判断":"塑料；塑料制品","HS6":"3923.30","10位申报":"3923.30.90.90","B3 Duty / MFN":"6.5%","口径":"包装容器","id":66,"order":65},{"类别":"塑料制品","中英品名":"塑料盖/瓶盖 / plastic lids caps closures","材质/用途判断":"塑料；鞋帽","HS6":"3923.50","10位申报":"3923.50.90.90","B3 Duty / MFN":"6.5%","口径":"包装封口件","id":67,"order":66},{"类别":"塑料制品","中英品名":"其他塑料包装件；other plastic packing articles；内衬包装；liner package；急救收纳盒/收纳盒；First Aid Storage；Storage box；收纳盒","材质/用途判断":"材质：塑料；用途/关键词：箱包、医疗/护理、塑料制品","HS6":"3923.90","10位申报":"3923.90.90.90","B3 Duty / MFN":"6.5%","口径":"包装专用；塑料制品；按原始HS 3923.90 归类；合并自4条同HS记录","id":68,"order":67},{"类别":"塑料制品","中英品名":"塑料餐具厨房用品 / plastic tableware kitchenware","材质/用途判断":"塑料；家具/家居","HS6":"3924.10","10位申报":"3924.10.00.00","B3 Duty / MFN":"6.5%","口径":"餐厨用途","id":69,"order":68},{"类别":"塑料制品","中英品名":"ABS收纳袋 / ABS storage bag","材质/用途判断":"塑料；箱包","HS6":"3924.10","10位申报":"3924.10.00.92","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3924.10 归类","id":70,"order":69},{"类别":"塑料制品","中英品名":"意面架 / Pasta Rack","材质/用途判断":"塑料；家具/家居","HS6":"3924.10","10位申报":"3924.10.00.99","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3924.10 归类","id":71,"order":70},{"类别":"塑料制品","中英品名":"塑料家庭/卫生用品 / plastic household sanitary articles","材质/用途判断":"塑料；塑料制品","HS6":"3924.90","10位申报":"3924.90.00.00","B3 Duty / MFN":"6.5%","口径":"家用非餐厨","id":72,"order":71},{"类别":"塑料制品","中英品名":"塑料衣架 / Plastic hanger","材质/用途判断":"塑料；服装","HS6":"3924.90","10位申报":"3924.90.00.70","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3924.90 归类","id":73,"order":72},{"类别":"塑料制品","中英品名":"猫门 / cat door","材质/用途判断":"塑料；塑料制品","HS6":"3924.90","10位申报":"3924.90.00.93","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3924.90 归类","id":74,"order":73},{"类别":"塑料制品","中英品名":"充气水垫/垫 / Inflatable Water Mat / Water Mat","材质/用途判断":"塑料；家具/家居","HS6":"3924.90","10位申报":"3924.90.00.99","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3924.90 归类","id":75,"order":74},{"类别":"塑料制品","中英品名":"折叠百叶帘 / Folding blinds","材质/用途判断":"塑料；塑料制品","HS6":"3925.30","10位申报":"3925.30.00.10","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3925.30 归类","id":76,"order":75},{"类别":"塑料制品","中英品名":"卷帘 / roller blinds","材质/用途判断":"塑料；塑料制品","HS6":"3925.30","10位申报":"3925.30.00.90","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3925.30 归类","id":77,"order":76},{"类别":"塑料制品","中英品名":"塑料办公学校用品 / plastic office or school supplies","材质/用途判断":"塑料；塑料制品","HS6":"3926.10","10位申报":"3926.10.00.90","B3 Duty / MFN":"6.5%","口径":"办公/学校用途优先","id":78,"order":77},{"类别":"塑料制品","中英品名":"皮带 / BELT","材质/用途判断":"塑料；塑料制品","HS6":"3926.20","10位申报":"3926.20.93.00","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3926.20 归类","id":79,"order":78},{"类别":"塑料制品","中英品名":"塑料服装附件 / plastic apparel accessories","材质/用途判断":"塑料；服装","HS6":"3926.20","10位申报":"3926.20.99.90","B3 Duty / MFN":"6.5%","口径":"穿戴附件","id":80,"order":79},{"类别":"塑料制品","中英品名":"塑料家具/车体类配件 / plastic fittings","材质/用途判断":"塑料；家具/家居","HS6":"3926.30","10位申报":"3926.30.00.00","B3 Duty / MFN":"Free","口径":"按配件用途","id":81,"order":80},{"类别":"塑料制品","中英品名":"乌鸦装饰摆件；Crow Ornaments；仿真盆景/仿真微景观；Artificial bonsai；Artificial micro landscape；塑料装饰摆件；plastic ornaments","材质/用途判断":"材质：塑料；用途/关键词：塑料制品、鞋帽","HS6":"3926.40","10位申报":"3926.40.90.00","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3926.40 归类；装饰陈列用；合并自3条同HS记录","id":82,"order":81},{"类别":"塑料制品","中英品名":"ABS发夹/塑料发夹；ABS hairpin；Plastic hairpin；ABS塑料齿轮；ABS plastic gear；PP收纳篮；PP Storage basket；PVC收纳盒；PVC Storage Box；PVC派对面具/塑料/树脂制品；PVC party mask；Plastic Party Tool；三角收纳篮架/旋转篮/塑料/树脂盒；Triangle basket storage rack/Rotating Basket；Plastic Storage Box；仿真树枝/塑料/树脂制品；Artificial branches；Plastic Artificial Branches；仿真植物；Simulated plant；Artificial Plant；伸缩桨；Retractable Paddle；冰格/塑料/树脂制品；Ice Tray；Plastic Tool；加厚轮/塑料/树脂制品；Thickening wheel；Plastic Part；口气清新贴/呼吸贴/塑料膜；Breath Strips；Plastic film；吸鼻器/塑料/树脂制品；Nasal Aspirator；塑料/树脂支具/护齿器/塑料保护套；Plastic orthodontic braces/Mouth Guard Device；Plastic cover；塑料宠物用品；plastic pet articles；塑料按摩器/塑料/树脂制品；Plastic massager；Plastic roller；塑料按摩器/脸部按摩器/塑料手动滚轮；Plastic massager/Face massager；Plastic manual roller；塑料贴片；Plastic patch；塑料钥匙扣；plastic keychains；塑料钥匙扣挂件；Plastic keychain pendant；塑料鞋架；Plastic Shoe Rack；塑料鼻呼吸器/塑料保护套；Plastic nasal respirator；太阳能电池片/塑料/树脂制品；solar cell；plastic panel；婴儿篮；bassinet basket；工具盒；workbox；成品假牙；Finished Artificial Denture；手指固定带/固定保护套；Finger fixation strap；fixation protector；手臂按摩器/手臂滚轮；Arm massager；Arm roller；打磨海绵/打磨工具；Sanding Sponges；Sanding Tool；按摩滚轮/塑料手动滚轮；massage roller；收纳架；storage holders；数学教具/塑料/树脂垫；Maths aids；Plastic Math Learning Tool；无线耳机/塑料/树脂制品；Wireless headphones；普通塑料日用品；plastic general articles；树脂假牙/塑料/树脂制品；Resin dentures；树脂牙贴面/预成型片；Resin dental veneers；Preformed Sheets；桌面装饰摆件/桌面摆件；living table ornaments；table ornaments；止鼾鼻贴/鼻贴；Anti snoring nose patch；nose patch；水胶体支具支撑/tape；Braces Supports Hydrocolloid Patch Bandages；tape；泳池捞网/塑料/树脂制品；Swimming pool skimmer net；Plastic pool skimmer net；浇水壶；Watering can；灯泡更换器/塑料/树脂制品；Light Bulb Changer；猫毛收纳器；Cat hair storage；猫爬架/塑料/树脂制品；Cat climbing frame；plastic frame；眼部按摩器/眼部滚轮；eye massager；eye roller；空气炸锅托盘/托盘；Air fried plate tray；plate tray；穿戴甲/美甲装饰；Press on Nails；Nail decoration；美甲色卡；Nail color card；肌肉贴/tape；Muscle tape；花园塑料用品；garden plastic articles；转接环/塑料/树脂戒指；Adapter ring；Plastic Ring；铜制烤箱接头；Copper oven connector；锯盒/塑料/树脂盒；Saw box；Plastic box；集尘袋；Dust Bags；颈托/塑料颈部保护器；neck brace；Plastic neck protecter；首饰展示盘；Jewelry Display Tray；鸟架/塑料/树脂制品；BirdStand；Plastic Stand；黑色首饰盒/收纳盒；Black jewelry box；Storage box；棉质装饰篮/收纳盒；Cotton Decorative Basket；涤纶矫形带；Polyester Orthotics Band；衣物防尘罩；Clothes Dustproof Cover；不锈钢戒指/硅胶蛋糕模；Stainless steel ring；Silicone Cake Mold；硅胶假牙/塑料保护套；Silicone Dentures；硅胶搅拌棒；Silicone stirring rod；硅胶车钥匙套；Silicone Car Key Case","材质/用途判断":"材质：塑料、铜/黄铜、棉、涤纶/聚酯、纺织面料、不锈钢、硅胶；用途/关键词：塑料制品、鞋帽、家具/家居、服装、医疗/护理、玩具/运动、电子电器、机械器具、箱包、首饰饰品、灯具、车辆配件、纺织制品","HS6":"3926.90","10位申报":"3926.90.99.90","B3 Duty / MFN":"6.5%","口径":"塑料制品；按原始HS 3926.90 归类；塑料杂项；普通塑料杂项制品；塑料园艺；合并自65条同HS记录；关联类别：塑料制品、纺织制品、纺织服装、硅胶制品","id":83,"order":82},{"类别":"塑料制品","中英品名":"宠物项圈牵引绳；pet collars leashes harness；宠物衣服；dog coats pet clothes","材质/用途判断":"材质：塑料、纺织面料；用途/关键词：塑料制品、服装","HS6":"4201.00","10位申报":"4201.00.90.90","B3 Duty / MFN":"7%","口径":"动物鞍具/挽具；动物用品；合并自2条同HS记录；关联类别：塑料制品、纺织服装","id":84,"order":83},{"类别":"塑料制品","中英品名":"橡塑鞋 / rubber plastic footwear","材质/用途判断":"橡胶、塑料；鞋帽","HS6":"6402.99","10位申报":"6402.99.90.00","B3 Duty / MFN":"17.5%","口径":"普通塑胶鞋","id":85,"order":84},{"类别":"塑料制品","中英品名":"人工花-塑料 / artificial flowers plastic","材质/用途判断":"塑料；塑料制品","HS6":"6702.10","10位申报":"6702.10.00.00","B3 Duty / MFN":"5%","口径":"人造花","id":86,"order":85},{"类别":"塑料制品","中英品名":"其他座椅 / other seats","材质/用途判断":"钢铁/金属、塑料；家具/家居","HS6":"9401.80","10位申报":"9401.80.10.00","B3 Duty / MFN":"9.5%","口径":"家用座椅","id":87,"order":86},{"类别":"塑料制品","中英品名":"PP清洁刷/刷子；PP cleaning brush；brush；塑料牙刷/塑料刷；plastic tooth brush；plastic brush；电动牙刷/塑料刷；Electric Toothbrush","材质/用途判断":"材质：塑料；用途/关键词：塑料制品、医疗/护理、电子电器","HS6":"9603.10","10位申报":"9603.10.20.00","B3 Duty / MFN":"7%","口径":"刷类；按原始HS 9603.10 归类；合并自3条同HS记录","id":88,"order":87},{"类别":"塑料制品","中英品名":"纽扣 / buttons","材质/用途判断":"钢铁/金属、塑料；塑料制品","HS6":"9606.29","10位申报":"9606.29.00.90","B3 Duty / MFN":"Free","口径":"纽扣","id":89,"order":88},{"类别":"纺织制品","中英品名":"A4打印纸 / A4 copy paper","材质/用途判断":"纺织面料、纸；纺织制品","HS6":"4802.56","10位申报":"4802.56.00.90","B3 Duty / MFN":"Free","口径":"书写印刷用纸","id":90,"order":89},{"类别":"纺织制品","中英品名":"普通书写印刷纸 / writing printing paper","材质/用途判断":"纺织面料、纸；纺织制品","HS6":"4802.57","10位申报":"4802.57.00.00","B3 Duty / MFN":"Free","口径":"按规格克重","id":91,"order":90},{"类别":"纺织制品","中英品名":"绳索-合成纤维 / synthetic cord rope","材质/用途判断":"尼龙、涤纶/聚酯；纺织制品","HS6":"5607.50","10位申报":"5607.50.90.00","B3 Duty / MFN":"10%","口径":"按绳索材质","id":92,"order":91},{"类别":"纺织制品","中英品名":"网；made-up nets；花园网/货网；garden cargo nets","材质/用途判断":"用途/关键词：玩具/运动、车辆配件","HS6":"5608.19","10位申报":"5608.19.90.00","B3 Duty / MFN":"14%","口径":"网类；合并自2条同HS记录","id":93,"order":92},{"类别":"纺织制品","中英品名":"绳线制品 / articles of yarn cordage rope","材质/用途判断":"纺织制品","HS6":"5609.00","10位申报":"5609.00.00.00","B3 Duty / MFN":"14%","口径":"绳线制成品","id":94,"order":93},{"类别":"纺织制品","中英品名":"地垫/垫 / base mat / mat","材质/用途判断":"纺织面料；纺织制品","HS6":"5703.90","10位申报":"5703.90.90.00","B3 Duty / MFN":"10%","口径":"纺织制品；按原始HS 5703.90 归类","id":95,"order":94},{"类别":"纺织制品","中英品名":"兔毛材料 / Rabbit Fur Material","材质/用途判断":"纺织面料；纺织制品","HS6":"5801.90","10位申报":"5801.90.00.00","B3 Duty / MFN":"Free","口径":"纺织制品；按原始HS 5801.90 归类","id":96,"order":95},{"类别":"纺织制品","中英品名":"织带-化纤 / narrow woven fabrics man-made","材质/用途判断":"尼龙、涤纶/聚酯、纺织面料；纺织制品","HS6":"5806.32","10位申报":"5806.32.00.90","B3 Duty / MFN":"Free","口径":"窄幅织物","id":97,"order":96},{"类别":"纺织制品","中英品名":"布标签 / textile labels woven","材质/用途判断":"纺织面料；纺织制品","HS6":"5807.10","10位申报":"5807.10.00.00","B3 Duty / MFN":"Free","口径":"纺织标签","id":98,"order":97},{"类别":"纺织制品","中英品名":"涂层纺织布；coated textile fabric；涤纶狗窝布；Polyester Dogs Kennel cloth","材质/用途判断":"材质：塑料、纺织面料、涤纶/聚酯；用途/关键词：纺织制品","HS6":"5903.90","10位申报":"5903.90.20.00","B3 Duty / MFN":"Free","口径":"含化纤涂层布；纺织制品；按原始HS 5903.90 归类；合并自2条同HS记录","id":99,"order":98},{"类别":"纺织制品","中英品名":"婴儿服-棉针织 / babies cotton knit garments","材质/用途判断":"棉、纺织面料；纺织制品","HS6":"6111.20","10位申报":"6111.20.00.00","B3 Duty / MFN":"Free","口径":"婴儿针织","id":100,"order":99},{"类别":"纺织制品","中英品名":"棉制品/涤纶/聚酯袜子/袜子；Cotton and Polyester socks；socks；莱卡分趾器/袜子；Lycras toe divider；Sock","材质/用途判断":"材质：涤纶/聚酯、棉、莱卡/氨纶；用途/关键词：纺织制品","HS6":"6115.95","10位申报":"6115.95.00.20","B3 Duty / MFN":"16%","口径":"服装；按原始HS 6115.95 归类；合并自2条同HS记录","id":101,"order":100},{"类别":"纺织制品","中英品名":"男外套-化纤 / men man-made jackets coats","材质/用途判断":"服装","HS6":"6201.40","10位申报":"6201.40.90.90","B3 Duty / MFN":"17%","口径":"男式外套","id":102,"order":101},{"类别":"纺织制品","中英品名":"女外套-化纤 / women man-made jackets coats","材质/用途判断":"服装","HS6":"6202.40","10位申报":"6202.40.00.90","B3 Duty / MFN":"18%","口径":"女式外套","id":103,"order":102},{"类别":"纺织制品","中英品名":"无纺/毡布服装 / garments of nonwoven felt","材质/用途判断":"纺织面料；纺织制品","HS6":"6210.10","10位申报":"6210.10.90.00","B3 Duty / MFN":"18%","口径":"特殊布料服装","id":104,"order":103},{"类别":"纺织制品","中英品名":"运动服/其他服装-化纤 / other garments man-made","材质/用途判断":"玩具/运动","HS6":"6211.43","10位申报":"6211.43.90.00","B3 Duty / MFN":"18%","口径":"其他服装","id":105,"order":104},{"类别":"纺织制品","中英品名":"假领；(False) Collar；服装附件；clothing accessories；羊毛/绒制品/耳罩；Two black fleece ear cups SQ RE0Q E344；ear cups","材质/用途判断":"材质：纺织面料、羊毛；用途/关键词：纺织制品","HS6":"6217.10","10位申报":"6217.10.00.00","B3 Duty / MFN":"15%","口径":"服装；按原始HS 6217.10 归类；服装附件；合并自3条同HS记录","id":106,"order":105},{"类别":"纺织制品","中英品名":"防晒袖套 / Decorative sunscreen sleeves","材质/用途判断":"纺织面料；纺织制品","HS6":"6217.90","10位申报":"6217.90.00.00","B3 Duty / MFN":"Free","口径":"服装；按原始HS 6217.90 归类","id":107,"order":106},{"类别":"纺织制品","中英品名":"毯子-合成纤维 / synthetic blankets","材质/用途判断":"涤纶/聚酯；纺织制品","HS6":"6301.40","10位申报":"6301.40.00.00","B3 Duty / MFN":"17%","口径":"毯子按纤维","id":108,"order":107},{"类别":"纺织制品","中英品名":"格纹家居套装 / Plaid home set","材质/用途判断":"纺织面料；纺织制品","HS6":"6302.22","10位申报":"6302.22.00.00","B3 Duty / MFN":"18%","口径":"纺织制品；按原始HS 6302.22 归类","id":109,"order":108},{"类别":"纺织制品","中英品名":"床上/桌上/厨房布草-棉 / cotton bed table kitchen linen","材质/用途判断":"棉、亚麻、纺织面料；家具/家居","HS6":"6302.31","10位申报":"6302.31.00.00","B3 Duty / MFN":"17%","口径":"布草按纤维","id":110,"order":109},{"类别":"纺织制品","中英品名":"床上/桌上/厨房布草-化纤 / man-made fibre linen","材质/用途判断":"亚麻、纺织面料；家具/家居","HS6":"6302.32","10位申报":"6302.32.00.00","B3 Duty / MFN":"18%","口径":"布草按纤维","id":111,"order":110},{"类别":"纺织制品","中英品名":"窗帘-棉 / cotton curtains","材质/用途判断":"棉、纺织面料；纺织制品","HS6":"6303.91","10位申报":"6303.91.00.00","B3 Duty / MFN":"17%","口径":"窗帘按纤维","id":112,"order":111},{"类别":"纺织制品","中英品名":"窗帘-合成纤维 / synthetic curtains","材质/用途判断":"涤纶/聚酯、纺织面料；纺织制品","HS6":"6303.92","10位申报":"6303.92.90.90","B3 Duty / MFN":"18%","口径":"窗帘按纤维","id":113,"order":112},{"类别":"纺织制品","中英品名":"涤纶床罩/罩/套 / Polyester bed cover / bed cover","材质/用途判断":"涤纶/聚酯、纺织面料；家具/家居","HS6":"6304.19","10位申报":"6304.19.00.00","B3 Duty / MFN":"18%","口径":"纺织制品；按原始HS 6304.19 归类","id":114,"order":113},{"类别":"纺织制品","中英品名":"家居软装-棉 / cotton furnishing articles","材质/用途判断":"棉、纺织面料；家具/家居","HS6":"6304.92","10位申报":"6304.92.90.00","B3 Duty / MFN":"17%","口径":"非床品软装","id":115,"order":114},{"类别":"纺织制品","中英品名":"家居软装-合成纤维；synthetic furnishing articles；帐篷/防尘罩；TENT；Dust Cover","材质/用途判断":"材质：纺织面料；用途/关键词：纺织制品","HS6":"6304.93","10位申报":"6304.93.90.00","B3 Duty / MFN":"18%","口径":"非床品软装；纺织制品；按原始HS 6304.93 归类；合并自2条同HS记录","id":116,"order":115},{"类别":"纺织制品","中英品名":"纺织包装袋-PP/PE条带 / textile packing sacks","材质/用途判断":"塑料、纺织面料；箱包","HS6":"6305.33","10位申报":"6305.33.00.90","B3 Duty / MFN":"18%","口径":"装货包装袋","id":117,"order":116},{"类别":"纺织制品","中英品名":"帐篷 / tents synthetic","材质/用途判断":"纺织制品","HS6":"6306.22","10位申报":"6306.22.00.90","B3 Duty / MFN":"18%","口径":"户外露营","id":118,"order":117},{"类别":"纺织制品","中英品名":"汽车遮阳帘/化纤遮阳帘 / Car interior sunshade / Chemical fiber sunshade","材质/用途判断":"纺织面料；车辆配件","HS6":"6306.90","10位申报":"6306.90.90.00","B3 Duty / MFN":"18%","口径":"纺织制品；按原始HS 6306.90 归类","id":119,"order":118},{"类别":"纺织制品","中英品名":"其他纺织制成品 / other made-up textile articles","材质/用途判断":"纺织面料；纺织制品","HS6":"6307.90","10位申报":"6307.90.99.00","B3 Duty / MFN":"18%","口径":"纺织杂项","id":120,"order":119},{"类别":"纺织制品","中英品名":"Cloth crafts cloth hangings/布艺工艺品；Cloth crafts cloth hangings；Cloth crafts；包带；Bag Strap；帐篷/户外罩；TENT；Outdoor Cover；成人可洗护理垫/垫片/护理垫；Adult Washable Underpad；pad；足膜；foot mask；足膜/保湿面膜/保湿发膜/面罩/面膜；moisture mask/Moisturizing Hair Mask；hydrating mask","材质/用途判断":"材质：纺织面料；用途/关键词：纺织制品、箱包、鞋帽","HS6":"6307.90","10位申报":"6307.90.99.90","B3 Duty / MFN":"18%","口径":"纺织制品；按原始HS 6307.90 归类；合并自6条同HS记录；关联类别：纺织制品、纺织鞋帽","id":121,"order":120},{"类别":"纺织制品","中英品名":"人工花-其他材料 / artificial flowers other","材质/用途判断":"纺织面料、纸；纺织制品","HS6":"6702.90","10位申报":"6702.90.90.00","B3 Duty / MFN":"6.5%","口径":"人造花","id":122,"order":121},{"类别":"纺织制品","中英品名":"表带-塑料/橡胶/纺织 / watch straps non-metal","材质/用途判断":"钢铁/金属、橡胶、塑料、纺织面料；纺织制品","HS6":"9113.90","10位申报":"9113.90.00.90","B3 Duty / MFN":"Free","口径":"表带","id":123,"order":122},{"类别":"纺织制品","中英品名":"PP棉填充玩具/填充玩具 / PP cotton stuffed toy / stuffed toy","材质/用途判断":"塑料、棉；玩具/运动","HS6":"9503.00","10位申报":"9503.00.90.52","B3 Duty / MFN":"Free","口径":"玩具；按原始HS 9503.00 归类","id":124,"order":123},{"类别":"纺织制品","中英品名":"棉质护理垫/棉垫 / Cotton Nursing Pad / cotton pad","材质/用途判断":"棉；纺织制品","HS6":"9619.00","10位申报":"9619.00.24.00","B3 Duty / MFN":"17%","口径":"洗护用品；按原始HS 9619.00 归类","id":125,"order":124},{"类别":"钢铁/金属制品","中英品名":"扭纹戒指/女士合金项链/时尚手链/合金戒指/不锈钢戒指/不锈钢耳环/圆环/合金耳夹/等 / Twist ring/Womens Alloy necklace/Fashoin Bracelet/Alloy Ring/Stainless steel ring/Stainless steel earrings/Round ring/Alloy ear clip / Alloy Womens Ring/Womens Alloy necklace/Fashoin Bracelet/Alloy Ring/Stainless steel ring/Stainless steel earrings/Round ring/Alloy ear clip","材质/用途判断":"不锈钢；服装","HS6":"7117.19","10位申报":"7117.19.90.00","B3 Duty / MFN":"8.5%","口径":"饰品；按原始HS 7117.19 归类","id":126,"order":125},{"类别":"钢铁/金属制品","中英品名":"工业杠铃/穿刺饰品/杠铃/穿刺饰品；Industrial barbell；barbell；钢制挠痒棒；steel Tickle stick；钢耳环；steel earring；银色项链/项链；silver necklace；necklace","材质/用途判断":"材质：钢铁/金属；用途/关键词：玩具/运动、钢铁/金属制品、首饰饰品","HS6":"7117.90","10位申报":"7117.90.00.00","B3 Duty / MFN":"8.5%","口径":"饰品；按原始HS 7117.90 归类；合并自4条同HS记录","id":127,"order":126},{"类别":"钢铁/金属制品","中英品名":"围栏 / Fence (普通铁丝)","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"7314.39","10位申报":"7314.39.00.00","B3 Duty / MFN":"Free","口径":"钢铁制品；按原始HS 7314.39 归类","id":128,"order":127},{"类别":"钢铁/金属制品","中英品名":"围栏 / Fence (不锈钢)","材质/用途判断":"不锈钢；钢铁/金属制品","HS6":"7314.41","10位申报":"7314.41.00.00","B3 Duty / MFN":"Free","口径":"钢铁制品；按原始HS 7314.41 归类","id":129,"order":128},{"类别":"钢铁/金属制品","中英品名":"围栏 / Fence (特种合金钢)","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"7314.49","10位申报":"7314.49.00.00","B3 Duty / MFN":"Free","口径":"钢铁制品；按原始HS 7314.49 归类","id":130,"order":129},{"类别":"钢铁/金属制品","中英品名":"金属制品 / Metal Kitchenware","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"7323.93","10位申报":"7323.93.90.10","B3 Duty / MFN":"6.5%","口径":"钢铁制品；按原始HS 7323.93 归类","id":131,"order":130},{"类别":"钢铁/金属制品","中英品名":"不锈钢厨房用品；stainless steel kitchenware；厨房用品；Kitchenware；金属盒；Metal Box etc","材质/用途判断":"材质：不锈钢、钢铁/金属；用途/关键词：钢铁/金属制品","HS6":"7323.93","10位申报":"7323.93.90.90","B3 Duty / MFN":"6.5%","口径":"不锈钢餐厨；钢铁制品；按原始HS 7323.93 归类；合并自3条同HS记录","id":132,"order":131},{"类别":"钢铁/金属制品","中英品名":"其他钢铁家用餐厨品；other iron steel household articles；烤盘；baking tray；烧烤铁笼/厨房用品；Bbq iron cage；Kitchenware；钢架；(Iron or Steel) Metal Shelf；铸铁炉架/格栅/厨房用品；Cast Iron Grilles；铝合金切模/饼干模具；Aluminium Alloy Cutting Mold；cookie molds；竹砧板/厨房用品；Bamboo Cutting Boards；硅胶盘/厨房用品；Silicone plates","材质/用途判断":"材质：钢铁/金属、铝、木/竹、硅胶；用途/关键词：钢铁/金属制品、家具/家居、铝制品、木竹制品、硅胶制品","HS6":"7323.99","10位申报":"7323.99.00.90","B3 Duty / MFN":"6.5%","口径":"钢铁家用；钢铁制品；按原始HS 7323.99 归类；合并自8条同HS记录；关联类别：钢铁/金属制品、铝制品、木竹制品、硅胶制品","id":133,"order":132},{"类别":"钢铁/金属制品","中英品名":"合金车模；Alloy car model；圆形烧烤网；Round grill mesh；尿道扩张器/铁制品；Penis Plug Urethra Dilator；Iron Tool；汽车轮胎气门帽；Car tire valve cap；金属探测器/金属制品；Metal detector；Metal part；铝合金钥匙套/罩/套；aluminum alloy key cover；alloy key cover；铜管/管道/管；copper pipe/pipeline；pipe","材质/用途判断":"材质：钢铁/金属、铝、铜/黄铜；用途/关键词：车辆配件、钢铁/金属制品、鞋帽、电子电器、铝制品、铜制品","HS6":"7326.90","10位申报":"7326.90.90.90","B3 Duty / MFN":"6.5%","口径":"钢铁制品；按原始HS 7326.90 归类；合并自7条同HS记录；关联类别：钢铁/金属制品、铝制品、铜制品","id":134,"order":133},{"类别":"钢铁/金属制品","中英品名":"锁扣板 / strike plate","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"7326.90","10位申报":"7326.90.99.90","B3 Duty / MFN":"","口径":"钢铁制品；按原始HS 7326.90 归类","id":135,"order":134},{"类别":"钢铁/金属制品","中英品名":"耙锄镐 / rakes hoes picks","材质/用途判断":"钢铁/金属制品","HS6":"8201.30","10位申报":"8201.30.90.00","B3 Duty / MFN":"6%","口径":"园艺农具","id":136,"order":135},{"类别":"钢铁/金属制品","中英品名":"园艺剪 / secateurs pruners","材质/用途判断":"钢铁/金属制品","HS6":"8201.50","10位申报":"8201.50.00.00","B3 Duty / MFN":"Free","口径":"园艺工具","id":137,"order":136},{"类别":"钢铁/金属制品","中英品名":"钳子镊子 / pliers tweezers","材质/用途判断":"工具/五金","HS6":"8203.20","10位申报":"8203.20.00.00","B3 Duty / MFN":"6.5%","口径":"手工具","id":138,"order":137},{"类别":"钢铁/金属制品","中英品名":"钳子 / pliers","材质/用途判断":"工具/五金","HS6":"8203.20","10位申报":"8203.20.00.10","B3 Duty / MFN":"6.5%","口径":"手工具；按原始HS 8203.20 归类","id":139,"order":138},{"类别":"钢铁/金属制品","中英品名":"家用手工具 / household hand tools","材质/用途判断":"电子电器","HS6":"8205.51","10位申报":"8205.51.90.00","B3 Duty / MFN":"6.5%","口径":"手工具","id":140,"order":139},{"类别":"钢铁/金属制品","中英品名":"凹陷修复钩 / Dent repair hooks","材质/用途判断":"钢铁/金属制品","HS6":"8205.59","10位申报":"8205.59.90.00","B3 Duty / MFN":"6.5%","口径":"手工具；按原始HS 8205.59 归类","id":141,"order":140},{"类别":"钢铁/金属制品","中英品名":"固定刀 / fixed blade knives","材质/用途判断":"工具/五金","HS6":"8211.92","10位申报":"8211.92.00.00","B3 Duty / MFN":"7%","口径":"刀具","id":142,"order":141},{"类别":"钢铁/金属制品","中英品名":"剪刀 / scissors shears","材质/用途判断":"工具/五金","HS6":"8213.00","10位申报":"8213.00.10.00","B3 Duty / MFN":"11%","口径":"剪刀","id":143,"order":142},{"类别":"钢铁/金属制品","中英品名":"叉子 / Fork","材质/用途判断":"工具/五金","HS6":"8215.10","10位申报":"8215.10.90.00","B3 Duty / MFN":"7%","口径":"刀剪餐具；按原始HS 8215.10 归类","id":144,"order":143},{"类别":"钢铁/金属制品","中英品名":"餐具刀叉勺 / cutlery spoons forks knives","材质/用途判断":"工具/五金","HS6":"8215.99","10位申报":"8215.99.10.00","B3 Duty / MFN":"11%","口径":"餐桌用刀叉勺","id":145,"order":144},{"类别":"钢铁/金属制品","中英品名":"夹钳/食品夹；tongs；铁板；Iron plate","材质/用途判断":"材质：钢铁/金属；用途/关键词：工具/五金","HS6":"8215.99","10位申报":"8215.99.90.00","B3 Duty / MFN":"6.5%","口径":"刀剪餐具；按原始HS 8215.99 归类；合并自2条同HS记录","id":146,"order":145},{"类别":"钢铁/金属制品","中英品名":"门滑轮/铰链 / Door Rollers / hinges","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"8302.10","10位申报":"8302.10.00.90","B3 Duty / MFN":"Free","口径":"金属五金；按原始HS 8302.10 归类","id":147,"order":146},{"类别":"钢铁/金属制品","中英品名":"门把手 / Door Handle","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"8302.41","10位申报":"8302.41.90.39","B3 Duty / MFN":"3.5%","口径":"金属五金；按原始HS 8302.41 归类","id":148,"order":147},{"类别":"钢铁/金属制品","中英品名":"窗帘杆 / Curtain Rod","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"8302.41","10位申报":"8302.41.90.41","B3 Duty / MFN":"3.5%","口径":"金属五金；按原始HS 8302.41 归类","id":149,"order":148},{"类别":"钢铁/金属制品","中英品名":"家具五金；furniture fittings；金属衣架；Metal hanger；钢制置物架/金属架；Steel Shelf；(General Metal) Metal Shelf","材质/用途判断":"材质：钢铁/金属；用途/关键词：家具/家居、服装","HS6":"8302.42","10位申报":"8302.42.00.90","B3 Duty / MFN":"Free","口径":"家具专用五金；金属五金；按原始HS 8302.42 归类；合并自3条同HS记录","id":150,"order":149},{"类别":"钢铁/金属制品","中英品名":"其他安装五金 / base metal mountings fittings","材质/用途判断":"钢铁/金属；家具/家居","HS6":"8302.49","10位申报":"8302.49.00.90","B3 Duty / MFN":"Free","口径":"通用安装五金","id":151,"order":150},{"类别":"钢铁/金属制品","中英品名":"支架 / brackets","材质/用途判断":"钢铁/金属；服装","HS6":"8302.50","10位申报":"8302.50.00.10","B3 Duty / MFN":"6.5%","口径":"金属五金；按原始HS 8302.50 归类","id":152,"order":151},{"类别":"钢铁/金属制品","中英品名":"架；racks(other)；衣钩；Clothes hook","材质/用途判断":"材质：钢铁/金属、纺织面料；用途/关键词：家具/家居、服装","HS6":"8302.50","10位申报":"8302.50.00.90","B3 Duty / MFN":"6.5%","口径":"金属五金；按原始HS 8302.50 归类；合并自2条同HS记录；关联类别：钢铁/金属制品、纺织服装","id":153,"order":152},{"类别":"钢铁/金属制品","中英品名":"合金纪念章；Alloy commemorative medal；金属装饰摆件；base metal ornaments","材质/用途判断":"材质：钢铁/金属；用途/关键词：钢铁/金属制品","HS6":"8306.29","10位申报":"8306.29.00.00","B3 Duty / MFN":"6.5%","口径":"金属五金；按原始HS 8306.29 归类；贱金属装饰；合并自2条同HS记录","id":154,"order":153},{"类别":"钢铁/金属制品","中英品名":"金属相框镜框 / metal photo frames mirrors","材质/用途判断":"钢铁/金属；钢铁/金属制品","HS6":"8306.30","10位申报":"8306.30.00.00","B3 Duty / MFN":"6%","口径":"框/镜","id":155,"order":154},{"类别":"钢铁/金属制品","中英品名":"金属制品/Furniture (other) / Metal products/Furniture (other)","材质/用途判断":"钢铁/金属；家具/家居","HS6":"9302.42","10位申报":"9302.42.00.90","B3 Duty / MFN":"","口径":"金属五金；按原始HS 9302.42 归类","id":156,"order":155},{"类别":"钢铁/金属制品","中英品名":"金属家具 / Metal Furniture","材质/用途判断":"钢铁/金属；家具/家居","HS6":"9403.20","10位申报":"9403.20.00.00","B3 Duty / MFN":"8%","口径":"家具；按原始HS 9403.20 归类","id":157,"order":156},{"类别":"钢铁/金属制品","中英品名":"金属家具 / metal furniture","材质/用途判断":"钢铁/金属；家具/家居","HS6":"9403.20","10位申报":"9403.20.00.90","B3 Duty / MFN":"8%","口径":"家具整件","id":158,"order":157},{"类别":"钢铁/金属制品","中英品名":"儿童收纳架/铁制家具框架；Childrens storage frame；Iron furniture frame；手推车/小推车/金属家具；trolley/small cart；metal furniture；金属制品；Other Metal Furniture；铁制品/金属制品/铁制家具框架/金属家具框架；Iron frame/Metal frame；Iron furniture frame/metal furniture frame","材质/用途判断":"材质：钢铁/金属；用途/关键词：家具/家居","HS6":"9403.20","10位申报":"9403.20.00.99","B3 Duty / MFN":"8%","口径":"家具；按原始HS 9403.20 归类；合并自4条同HS记录","id":159,"order":158},{"类别":"钢铁/金属制品","中英品名":"合金车模/汽车玩具 / Alloy Car Model / car toy","材质/用途判断":"钢铁/金属；玩具/运动","HS6":"9503.00","10位申报":"9503.00.90.84","B3 Duty / MFN":"Free","口径":"玩具；按原始HS 9503.00 归类","id":160,"order":159},{"类别":"纸/印刷制品","中英品名":"自粘塑料膜片 / self-adhesive plastic film sheet","材质/用途判断":"塑料、纸；纸/印刷制品","HS6":"3919.90","10位申报":"3919.90.00.90","B3 Duty / MFN":"Free","口径":"非窄卷自粘","id":161,"order":160},{"类别":"纸/印刷制品","中英品名":"美术纸巾 / Art Tissue","材质/用途判断":"纸；纸/印刷制品","HS6":"4802.54","10位申报":"4802.54.00.00","B3 Duty / MFN":"Free","口径":"纸制品；按原始HS 4802.54 归类","id":162,"order":161},{"类别":"纸/印刷制品","中英品名":"除毛器/内衬胶带纸 / Lint Remover / Liner Tape Paper","材质/用途判断":"纸；纸/印刷制品","HS6":"4811.41","10位申报":"4811.41.00.10","B3 Duty / MFN":"Free","口径":"纸制品；按原始HS 4811.41 归类","id":163,"order":162},{"类别":"纸/印刷制品","中英品名":"自粘纸/标签纸 / self-adhesive paper","材质/用途判断":"纸；纸/印刷制品","HS6":"4811.41","10位申报":"4811.41.00.90","B3 Duty / MFN":"Free","口径":"纸基自粘","id":164,"order":163},{"类别":"纸/印刷制品","中英品名":"信封 / envelopes","材质/用途判断":"纸；纸/印刷制品","HS6":"4817.10","10位申报":"4817.10.00.00","B3 Duty / MFN":"Free","口径":"信封","id":165,"order":164},{"类别":"纸/印刷制品","中英品名":"明信片/信卡 / letter cards postcards","材质/用途判断":"车辆配件","HS6":"4817.20","10位申报":"4817.20.00.00","B3 Duty / MFN":"Free","口径":"通信纸卡","id":166,"order":165},{"类别":"纸/印刷制品","中英品名":"宠物垫；Pet Pad；护垫/垫片/护理垫；pantyliner；pad；皮革缓冲垫/垫片/护理垫；leather recoil pad","材质/用途判断":"材质：塑料、纸、皮革/PU；用途/关键词：纸/印刷制品","HS6":"4818.90","10位申报":"4818.90.00.00","B3 Duty / MFN":"Free","口径":"纸制品；按原始HS 4818.90 归类；合并自3条同HS记录","id":167,"order":166},{"类别":"纸/印刷制品","中英品名":"瓦楞纸箱 / corrugated cartons boxes","材质/用途判断":"纸；车辆配件","HS6":"4819.10","10位申报":"4819.10.00.00","B3 Duty / MFN":"Free","口径":"瓦楞包装","id":168,"order":167},{"类别":"纸/印刷制品","中英品名":"折叠纸盒 / folding paper cartons","材质/用途判断":"纸；车辆配件","HS6":"4819.20","10位申报":"4819.20.00.00","B3 Duty / MFN":"Free","口径":"非瓦楞包装盒","id":169,"order":168},{"类别":"纸/印刷制品","中英品名":"纸袋 / paper bags sacks","材质/用途判断":"纸；箱包","HS6":"4819.40","10位申报":"4819.40.00.00","B3 Duty / MFN":"Free","口径":"纸袋包装","id":170,"order":169},{"类别":"纸/印刷制品","中英品名":"其他纸包装容器 / other paper packing containers","材质/用途判断":"纸；箱包","HS6":"4819.50","10位申报":"4819.50.00.00","B3 Duty / MFN":"Free","口径":"其他纸包装","id":171,"order":170},{"类别":"纸/印刷制品","中英品名":"办公室纸质收纳盒 / paper office storage box","材质/用途判断":"纸；纸/印刷制品","HS6":"4819.60","10位申报":"4819.60.00.00","B3 Duty / MFN":"Free","口径":"办公收纳纸品","id":172,"order":171},{"类别":"纸/印刷制品","中英品名":"笔记本/记事本 / notebook diary memo pad","材质/用途判断":"纸/印刷制品","HS6":"4820.10","10位申报":"4820.10.00.00","B3 Duty / MFN":"Free","口径":"纸制本册","id":173,"order":172},{"类别":"纸/印刷制品","中英品名":"练习本 / exercise books","材质/用途判断":"纸/印刷制品","HS6":"4820.20","10位申报":"4820.20.00.00","B3 Duty / MFN":"Free","口径":"练习本","id":174,"order":173},{"类别":"纸/印刷制品","中英品名":"纸质文件夹/活页夹 / binders folders","材质/用途判断":"纸；纸/印刷制品","HS6":"4820.30","10位申报":"4820.30.00.90","B3 Duty / MFN":"Free","口径":"纸质归档用品","id":175,"order":174},{"类别":"纸/印刷制品","中英品名":"相册/样本册 / albums","材质/用途判断":"纸/印刷制品","HS6":"4820.50","10位申报":"4820.50.00.00","B3 Duty / MFN":"Free","口径":"册类","id":176,"order":175},{"类别":"纸/印刷制品","中英品名":"印刷纸标签 / printed paper labels","材质/用途判断":"纸；纸/印刷制品","HS6":"4821.10","10位申报":"4821.10.00.00","B3 Duty / MFN":"Free","口径":"标签","id":177,"order":176},{"类别":"纸/印刷制品","中英品名":"未印刷纸标签 / paper labels not printed","材质/用途判断":"纸；纸/印刷制品","HS6":"4821.90","10位申报":"4821.90.00.00","B3 Duty / MFN":"Free","口径":"标签","id":178,"order":177},{"类别":"纸/印刷制品","中英品名":"说明书/小册子 / manuals leaflets brochures","材质/用途判断":"纸/印刷制品","HS6":"4901.99","10位申报":"4901.99.00.90","B3 Duty / MFN":"Free","口径":"印刷书册","id":179,"order":178},{"类别":"纸/印刷制品","中英品名":"生存指南手稿 / Survival guide manuscript","材质/用途判断":"纸；纸/印刷制品","HS6":"4901.99","10位申报":"4901.99.00.99","B3 Duty / MFN":"Free","口径":"印刷品；按原始HS 4901.99 归类","id":180,"order":179},{"类别":"纸/印刷制品","中英品名":"贺卡/祝福卡 / greeting cards","材质/用途判断":"车辆配件","HS6":"4909.00","10位申报":"4909.00.00.00","B3 Duty / MFN":"Free","口径":"印刷祝福卡","id":181,"order":180},{"类别":"纸/印刷制品","中英品名":"日历 / Calendar","材质/用途判断":"纸；纸/印刷制品","HS6":"4910.00","10位申报":"4910.00.00.00","B3 Duty / MFN":"Free","口径":"印刷品；按原始HS 4910.00 归类","id":182,"order":181},{"类别":"纸/印刷制品","中英品名":"商业目录/广告品；catalogues advertising material；宣传单；Leaflet","材质/用途判断":"材质：纸；用途/关键词：纸/印刷制品","HS6":"4911.10","10位申报":"4911.10.00.90","B3 Duty / MFN":"Free","口径":"商业印刷品；印刷品；按原始HS 4911.10 归类；合并自2条同HS记录","id":183,"order":182},{"类别":"纸/印刷制品","中英品名":"海报/图片/照片 / posters pictures photos","材质/用途判断":"纸/印刷制品","HS6":"4911.91","10位申报":"4911.91.00.20","B3 Duty / MFN":"Free","口径":"图片类印刷品","id":184,"order":183},{"类别":"纸/印刷制品","中英品名":"其他印刷品 / other printed matter","材质/用途判断":"纸；纸/印刷制品","HS6":"4911.99","10位申报":"4911.99.00.90","B3 Duty / MFN":"Free","口径":"未列名印刷品","id":185,"order":184},{"类别":"纺织服装","中英品名":"狗衣服/狗保暖毛绒衣服 / Dog clothes/Dog warm plush clothes / Dog clothes","材质/用途判断":"纺织面料；服装","HS6":"4203.29","10位申报":"4203.29.90.10","B3 Duty / MFN":"15.5%","口径":"宠物用品；按原始HS 4203.29 归类","id":186,"order":185},{"类别":"纺织服装","中英品名":"羊羔毛外套/外套 / Lamb wool jacket / jacket","材质/用途判断":"羊毛；服装","HS6":"6103.33","10位申报":"6103.33.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6103.33 归类","id":187,"order":186},{"类别":"纺织服装","中英品名":"女士针织涤纶连衣裙/连衣裙 / Women knitted polyester dresss / dresses","材质/用途判断":"涤纶/聚酯、纺织面料；服装","HS6":"6104.49","10位申报":"6104.49.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6104.49 归类","id":188,"order":187},{"类别":"纺织服装","中英品名":"功能打底衣/上衣/T恤 / Active Base Layers / shirt","材质/用途判断":"纺织面料；服装","HS6":"6106.90","10位申报":"6106.90.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6106.90 归类","id":189,"order":188},{"类别":"纺织服装","中英品名":"针织T恤-棉 / knit cotton T-shirts","材质/用途判断":"棉、纺织面料；服装","HS6":"6109.10","10位申报":"6109.10.00.00","B3 Duty / MFN":"18%","口径":"针织上衣","id":190,"order":189},{"类别":"纺织服装","中英品名":"男士速干T恤/男士T恤 / Men s Quick Dry T shirt / Mens T shirt","材质/用途判断":"纺织面料；服装","HS6":"6109.90","10位申报":"6109.90.00.10","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6109.90 归类","id":191,"order":190},{"类别":"纺织服装","中英品名":"女士亚麻T恤/上衣/T恤；Womens linen T shirt；Womens T shirt；针织T恤-其他；knit other T-shirts","材质/用途判断":"材质：亚麻、纺织面料、棉；用途/关键词：服装","HS6":"6109.90","10位申报":"6109.90.00.90","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6109.90 归类；针织上衣；合并自2条同HS记录","id":192,"order":191},{"类别":"纺织服装","中英品名":"针织毛衫/卫衣-棉 / knit cotton sweaters sweatshirts","材质/用途判断":"棉、纺织面料；服装","HS6":"6110.20","10位申报":"6110.20.00.90","B3 Duty / MFN":"18%","口径":"针织上装","id":193,"order":192},{"类别":"纺织服装","中英品名":"针织毛衫/卫衣-化纤 / knit man-made sweaters","材质/用途判断":"纺织面料；服装","HS6":"6110.30","10位申报":"6110.30.00.90","B3 Duty / MFN":"18%","口径":"针织上装","id":194,"order":193},{"类别":"纺织服装","中英品名":"男士运动球衣 / Mens sports jersey","材质/用途判断":"纺织面料；服装","HS6":"6110.90","10位申报":"6110.90.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6110.90 归类","id":195,"order":194},{"类别":"纺织服装","中英品名":"男裤-棉 / men cotton trousers","材质/用途判断":"棉；服装","HS6":"6203.42","10位申报":"6203.42.00.90","B3 Duty / MFN":"17%","口径":"男装裤类","id":196,"order":195},{"类别":"纺织服装","中英品名":"男士牛仔裤 / man Denimpants","材质/用途判断":"纺织面料；服装","HS6":"6203.49","10位申报":"6203.49.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6203.49 归类","id":197,"order":196},{"类别":"纺织服装","中英品名":"女裤-棉 / women cotton trousers","材质/用途判断":"棉；服装","HS6":"6204.62","10位申报":"6204.62.00.90","B3 Duty / MFN":"17%","口径":"女装裤类","id":198,"order":197},{"类别":"纺织服装","中英品名":"女士裤子 / Womens Pants","材质/用途判断":"纺织面料；服装","HS6":"6204.69","10位申报":"6204.69.00.90","B3 Duty / MFN":"17%","口径":"服装；按原始HS 6204.69 归类","id":199,"order":198},{"类别":"纺织服装","中英品名":"男衬衫-棉 / men cotton shirts","材质/用途判断":"棉；服装","HS6":"6205.20","10位申报":"6205.20.00.00","B3 Duty / MFN":"17%","口径":"男衬衫","id":200,"order":199},{"类别":"纺织服装","中英品名":"女衬衫-棉 / women cotton blouses","材质/用途判断":"棉；服装","HS6":"6206.30","10位申报":"6206.30.00.00","B3 Duty / MFN":"17%","口径":"女衬衫","id":201,"order":200},{"类别":"纺织服装","中英品名":"婴儿服-棉梭织；babies cotton woven garments；婴儿连体衣；Baby jumpsuit","材质/用途判断":"材质：棉、纺织面料；用途/关键词：纺织制品、服装","HS6":"6209.20","10位申报":"6209.20.00.00","B3 Duty / MFN":"Free","口径":"婴儿梭织；服装；按原始HS 6209.20 归类；合并自2条同HS记录；关联类别：纺织制品、纺织服装","id":202,"order":201},{"类别":"纺织服装","中英品名":"背心 / vest","材质/用途判断":"纺织面料；服装","HS6":"6211.33","10位申报":"6211.33.00.90","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6211.33 归类","id":203,"order":202},{"类别":"纺织服装","中英品名":"尼龙文胸 / Nylon Bra","材质/用途判断":"尼龙；服装","HS6":"6212.10","10位申报":"6212.10.00.90","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6212.10 归类","id":204,"order":203},{"类别":"纺织服装","中英品名":"薰衣草香包/家用香包 / Lavender Sachets / home Sachets","材质/用途判断":"纺织面料；服装","HS6":"6304.99","10位申报":"6304.99.90.00","B3 Duty / MFN":"17%","口径":"纺织制品；按原始HS 6304.99 归类","id":205,"order":204},{"类别":"纺织服装","中英品名":"火盆保温棉芯/羊毛/绒制品 / Brazier wool core / wool core","材质/用途判断":"棉、羊毛；服装","HS6":"6806.90","10位申报":"6806.90.00.90","B3 Duty / MFN":"Free","口径":"化工原料；按原始HS 6806.90 归类","id":206,"order":205},{"类别":"玩具/运动用品","中英品名":"普通玩具 / toys","材质/用途判断":"玩具/运动","HS6":"9503.00","10位申报":"9503.00.90.90","B3 Duty / MFN":"Free","口径":"玩具","id":207,"order":206},{"类别":"玩具/运动用品","中英品名":"塑料拼装玩具；Plastic assembly toys；针织娃娃/迷你毛绒睡眠娃娃/聚酯填充娃娃/娃娃；Knitted doll/Mini plush sleep doll/Polyester fiber filled doll；doll；仿真粪便玩具/玩具；Simulated feces；Simulated feces toy；建筑模型门/玩具模型；Building Models Door；Door Model toy；恶作剧套装/玩具；Prank Kit；Prank Toy；挤压爪玩具；Squeeze paws；显示控制卡；Display control card；玩具/雪花玩具；6-point snowflake toy；snowflake toy；肺活量训练器/呼吸训练玩具；Lung capacity trainer；Breath trainer toy；脚底按摩球/脚底滚动球；Foot massage ball；Foot rolling ball；车载敲击镲玩具；Car mounted tapping cymbal；迷你双人床玩具/玩具；Mini Double Bed；Mini Double Bed toy；纸质拼图；Paper puzzle","材质/用途判断":"材质：塑料、涤纶/聚酯、纺织面料、纸；用途/关键词：玩具/运动、灯具、鞋帽、家具/家居","HS6":"9503.00","10位申报":"9503.00.90.99","B3 Duty / MFN":"Free","口径":"玩具；按原始HS 9503.00 归类；合并自13条同HS记录；关联类别：塑料制品、纺织制品、玩具/运动用品、纸/印刷制品","id":208,"order":207},{"类别":"玩具/运动用品","中英品名":"桌游/游戏用品 / games","材质/用途判断":"家具/家居","HS6":"9504.90","10位申报":"9504.90.00.90","B3 Duty / MFN":"Free","口径":"游戏用品","id":209,"order":208},{"类别":"玩具/运动用品","中英品名":"圣诞用品 / Christmas articles","材质/用途判断":"玩具/运动用品","HS6":"9505.10","10位申报":"9505.10.00.00","B3 Duty / MFN":"Free","口径":"节日用品","id":210,"order":209},{"类别":"玩具/运动用品","中英品名":"万圣节南瓜灯；Halloween Jack o lantern；僵尸人偶；Walking Corpse Figures；彩绘装饰品；painted ornaments；派对节庆用品；party festive articles；装饰品/圣诞球/圣诞门帘/装饰摆件；Skeleton skeleton decorative ornaments/Christmas balls/Christmas Door Banner；Decorative ornaments；诺福克松花环/足部；Norfolk Pine Garland/foot Norfolk pine wreath","材质/用途判断":"用途/关键词：灯具、玩具/运动用品、玩具/运动","HS6":"9505.90","10位申报":"9505.90.00.90","B3 Duty / MFN":"Free","口径":"节庆用品；按原始HS 9505.90 归类；合并自6条同HS记录","id":211,"order":210},{"类别":"玩具/运动用品","中英品名":"球类-充气 / inflatable balls","材质/用途判断":"家具/家居","HS6":"9506.62","10位申报":"9506.62.00.00","B3 Duty / MFN":"Free","口径":"运动球","id":212,"order":211},{"类别":"玩具/运动用品","中英品名":"健身器材；exercise equipment；拉伸带；STRETCHING STRAP；瑜伽泡沫楔块；Yoga foam wedge；腹部支撑架/支撑；Abdominal support frame；support frame；负重手环；Weight bearing bracelet","材质/用途判断":"用途/关键词：玩具/运动用品、玩具/运动、家具/家居、服装","HS6":"9506.91","10位申报":"9506.91.00.90","B3 Duty / MFN":"Free","口径":"健身；运动用品；按原始HS 9506.91 归类；合并自5条同HS记录","id":213,"order":212},{"类别":"玩具/运动用品","中英品名":"地钉/螺丝/金属钉/小螺丝/不锈钢螺丝/不锈钢螺柱/轮胎钉；Ground Pegs/地钉/screw/Metal nail/Screws/small screw/Stainless steel screw/Stainless steel stud/Tire Studs；Ground Pegs/地钉；自攻螺丝/地钉；Self Tapping Screw","材质/用途判断":"材质：不锈钢；用途/关键词：玩具/运动","HS6":"9506.99","10位申报":"9506.99.00.60","B3 Duty / MFN":"Free","口径":"运动用品；按原始HS 9506.99 归类；合并自2条同HS记录；关联类别：钢铁/金属制品、玩具/运动用品","id":214,"order":213},{"类别":"玩具/运动用品","中英品名":"匹克球拍；Pickleball Paddle；护肘支具；Elbow Support Brace；护腰支具；Back Support Brace；登山扣；Mountaineering buckle；运动器材；sports equipment；皮革弹弓；Leather Shepherd Sling；木工导向器/登山杖；Woodworking Guide；hiking stick；硅胶手指训练器；Silicone Finger Exerciser","材质/用途判断":"材质：皮革/PU、木/竹、硅胶；用途/关键词：玩具/运动、服装","HS6":"9506.99","10位申报":"9506.99.00.90","B3 Duty / MFN":"Free","口径":"运动用品；按原始HS 9506.99 归类；合并自8条同HS记录；关联类别：玩具/运动用品、皮革/箱包制品、木竹制品、硅胶制品","id":215,"order":214},{"类别":"玩具/运动用品","中英品名":"钓竿 / fishing rods","材质/用途判断":"玩具/运动用品","HS6":"9507.10","10位申报":"9507.10.90.00","B3 Duty / MFN":"6.5%","口径":"钓具","id":216,"order":215},{"类别":"玩具/运动用品","中英品名":"鱼钩 / fish-hooks","材质/用途判断":"玩具/运动用品","HS6":"9507.20","10位申报":"9507.20.00.00","B3 Duty / MFN":"Free","口径":"钓具","id":217,"order":216},{"类别":"玩具/运动用品","中英品名":"其他钓具 / fishing tackle","材质/用途判断":"玩具/运动用品","HS6":"9507.90","10位申报":"9507.90.99.20","B3 Duty / MFN":"6.5%","口径":"钓具","id":218,"order":217},{"类别":"玩具/运动用品","中英品名":"鱼竿支架 / 鱼竿支架","材质/用途判断":"家具/家居","HS6":"9507.90","10位申报":"9507.90.99.90","B3 Duty / MFN":"6.5%","口径":"钓具；按原始HS 9507.90 归类","id":219,"order":218},{"类别":"化工/洗护制品","中英品名":"皂片 / Soap flakes","材质/用途判断":"洗护/化工","HS6":"3401.11","10位申报":"3401.11.90.00","B3 Duty / MFN":"6.5%","口径":"洗护用品；按原始HS 3401.11 归类","id":220,"order":219},{"类别":"化工/洗护制品","中英品名":"洗手液/洁肤制品 / skin washing preparations","材质/用途判断":"化工/洗护制品","HS6":"3401.30","10位申报":"3401.30.00.00","B3 Duty / MFN":"6.5%","口径":"洁肤","id":221,"order":220},{"类别":"化工/洗护制品","中英品名":"清洁剂/洗涤剂 / detergents cleaning preparations","材质/用途判断":"服装","HS6":"3402.50","10位申报":"3402.50.90.90","B3 Duty / MFN":"6.5%","口径":"清洁制剂","id":222,"order":221},{"类别":"化工/洗护制品","中英品名":"蜡 / WAX","材质/用途判断":"蜡；洗护/化工","HS6":"3404.20","10位申报":"3404.20.90.00","B3 Duty / MFN":"6.5%","口径":"蜡烛；按原始HS 3404.20 归类","id":223,"order":222},{"类别":"化工/洗护制品","中英品名":"蜡 / wax","材质/用途判断":"蜡；洗护/化工","HS6":"3404.90","10位申报":"3404.90.90.00","B3 Duty / MFN":"6.5%","口径":"蜡烛；按原始HS 3404.90 归类","id":224,"order":223},{"类别":"化工/洗护制品","中英品名":"便携化妆品/护理膏；Portable cosmetics；Polish cream；儿童面霜/护理膏；Children s face cream；护手霜/护发素/儿童面霜/定型啫喱/身体乳/身体保湿乳/保湿面霜/身体保湿乳液/等；Hand Cream/hair conditioner/Children s face cream/Shaping gel/Body Lotion/body moisturizer/moisturizing face cream/Body Moisturizing lotion/Men s face cream/Cleaning toothpaste/Neck cream/Bath bomb","材质/用途判断":"用途/关键词：家具/家居、洗护/化工","HS6":"3405.10","10位申报":"3405.10.90.00","B3 Duty / MFN":"6.5%","口径":"洗护用品；按原始HS 3405.10 归类；合并自3条同HS记录","id":225,"order":224},{"类别":"化工/洗护制品","中英品名":"蜡烛-节庆 / festive candles","材质/用途判断":"蜡；化工/洗护制品","HS6":"3406.00","10位申报":"3406.00.10.00","B3 Duty / MFN":"5.5%","口径":"节庆蜡烛","id":226,"order":225},{"类别":"化工/洗护制品","中英品名":"普通蜡烛 / candles","材质/用途判断":"蜡；化工/洗护制品","HS6":"3406.00","10位申报":"3406.00.90.00","B3 Duty / MFN":"5.5%","口径":"非节庆蜡烛","id":227,"order":226},{"类别":"化工/洗护制品","中英品名":"零售包装胶水 / retail glues adhesives","材质/用途判断":"箱包","HS6":"3506.10","10位申报":"3506.10.00.00","B3 Duty / MFN":"6.5%","口径":"胶粘剂","id":228,"order":227},{"类别":"化工/洗护制品","中英品名":"溶剂稀释剂 / solvents thinners","材质/用途判断":"机械器具","HS6":"3814.00","10位申报":"3814.00.00.00","B3 Duty / MFN":"Free","口径":"溶剂","id":229,"order":228},{"类别":"化工/洗护制品","中英品名":"铅笔/蜡笔 / pencils crayons","材质/用途判断":"蜡；化工/洗护制品","HS6":"9609.10","10位申报":"9609.10.00.00","B3 Duty / MFN":"7%","口径":"铅笔类","id":230,"order":229},{"类别":"家具/灯具家居","中英品名":"灯架 / Light Stand/Parts","材质/用途判断":"家具/家居","HS6":"9401.99","10位申报":"9401.99.00.00","B3 Duty / MFN":"Free","口径":"家具；按原始HS 9401.99 归类","id":231,"order":230},{"类别":"家具/灯具家居","中英品名":"户外家具 / outdoor furniture","材质/用途判断":"家具/家居","HS6":"9403.20","10位申报":"9403.20.00.50","B3 Duty / MFN":"8%","口径":"家具；按原始HS 9403.20 归类","id":232,"order":231},{"类别":"家具/灯具家居","中英品名":"婴儿床架 / Crib stand","材质/用途判断":"家具/家居","HS6":"9403.50","10位申报":"9403.50.00.10","B3 Duty / MFN":"9.5%","口径":"家具；按原始HS 9403.50 归类","id":233,"order":232},{"类别":"家具/灯具家居","中英品名":"睡袋 / sleeping bags","材质/用途判断":"箱包","HS6":"9404.30","10位申报":"9404.30.00.00","B3 Duty / MFN":"15.5%","口径":"睡袋","id":234,"order":233},{"类别":"家具/灯具家居","中英品名":"LED吊灯壁灯 / LED chandeliers wall lights","材质/用途判断":"灯具","HS6":"9405.11","10位申报":"9405.11.00.90","B3 Duty / MFN":"7%","口径":"固定照明","id":235,"order":234},{"类别":"家具/灯具家居","中英品名":"LED灯/灯具 / LED LIGHT / LIGHT","材质/用途判断":"灯具","HS6":"9405.11","10位申报":"9405.11.00.99","B3 Duty / MFN":"7%","口径":"灯具；按原始HS 9405.11 归类","id":236,"order":235},{"类别":"家具/灯具家居","中英品名":"LED其他电灯具；LED electric lamps luminaires；风扇灯；fan lamp","材质/用途判断":"用途/关键词：灯具","HS6":"9405.42","10位申报":"9405.42.90.00","B3 Duty / MFN":"7%","口径":"LED电灯具；灯具；按原始HS 9405.42 归类；合并自2条同HS记录","id":237,"order":236},{"类别":"家具/灯具家居","中英品名":"其他电灯具 / other electric luminaires","材质/用途判断":"灯具","HS6":"9405.49","10位申报":"9405.49.90.00","B3 Duty / MFN":"7%","口径":"其他电灯具","id":238,"order":237},{"类别":"家具/灯具家居","中英品名":"非电灯具 / non-electrical luminaires","材质/用途判断":"灯具","HS6":"9405.50","10位申报":"9405.50.90.00","B3 Duty / MFN":"7%","口径":"非电照明","id":239,"order":238},{"类别":"杂项制品","中英品名":"头皮按摩器/扫帚 / Scalp massager / Brooms","材质/用途判断":"杂项制品","HS6":"9603.29","10位申报":"9603.29.00.00","B3 Duty / MFN":"7%","口径":"刷类；按原始HS 9603.29 归类","id":240,"order":239},{"类别":"杂项制品","中英品名":"刷子 / brushes","材质/用途判断":"杂项制品","HS6":"9603.90","10位申报":"9603.90.90.00","B3 Duty / MFN":"6.5%","口径":"刷类","id":241,"order":240},{"类别":"杂项制品","中英品名":"拉链 / slide fasteners","材质/用途判断":"杂项制品","HS6":"9607.19","10位申报":"9607.19.00.00","B3 Duty / MFN":"11%","口径":"拉链","id":242,"order":241},{"类别":"杂项制品","中英品名":"圆珠笔/记号笔 / ball pens markers","材质/用途判断":"杂项制品","HS6":"9608.10","10位申报":"9608.10.00.00","B3 Duty / MFN":"7%","口径":"笔类","id":243,"order":242},{"类别":"杂项制品","中英品名":"眉笔/铅笔 / eyebrow pencil / pencil","材质/用途判断":"杂项制品","HS6":"9609.10","10位申报":"9609.10.00.20","B3 Duty / MFN":"7%","口径":"文具；按原始HS 9609.10 归类","id":244,"order":243},{"类别":"杂项制品","中英品名":"白板/黑板 / slates boards","材质/用途判断":"杂项制品","HS6":"9610.00","10位申报":"9610.00.00.00","B3 Duty / MFN":"4.5%","口径":"书写展示板","id":245,"order":244},{"类别":"杂项制品","中英品名":"梳子发夹 / combs hair slides","材质/用途判断":"杂项制品","HS6":"9615.19","10位申报":"9615.19.00.90","B3 Duty / MFN":"7%","口径":"头发用品","id":246,"order":245},{"类别":"杂项制品","中英品名":"动物梳 / animal comb","材质/用途判断":"杂项制品","HS6":"9615.90","10位申报":"9615.90.00.00","B3 Duty / MFN":"6.5%","口径":"发饰梳具；按原始HS 9615.90 归类","id":247,"order":246},{"类别":"杂项制品","中英品名":"保温杯/保温瓶 / vacuum flasks","材质/用途判断":"杂项制品","HS6":"9617.00","10位申报":"9617.00.00.00","B3 Duty / MFN":"7.5%","口径":"真空保温","id":248,"order":247},{"类别":"皮革/箱包制品","中英品名":"旅行箱；suitcases trunks；铅笔盒；pencil case","材质/用途判断":"材质：塑料、纺织面料、皮革/PU；用途/关键词：箱包","HS6":"4202.12","10位申报":"4202.12.90.00","B3 Duty / MFN":"11%","口径":"旅行容器；箱包；按原始HS 4202.12 归类；合并自2条同HS记录；关联类别：纺织制品、皮革/箱包制品","id":249,"order":248},{"类别":"皮革/箱包制品","中英品名":"手提包 / handbags","材质/用途判断":"皮革/PU；箱包","HS6":"4202.22","10位申报":"4202.22.90.90","B3 Duty / MFN":"10.5%","口径":"手提包","id":250,"order":249},{"类别":"皮革/箱包制品","中英品名":"RFID防磁长钱包/钱包 / RFID anti magnetic long wallet / Wallet","材质/用途判断":"箱包","HS6":"4202.31","10位申报":"4202.31.00.10","B3 Duty / MFN":"8.5%","口径":"箱包；按原始HS 4202.31 归类","id":251,"order":250},{"类别":"皮革/箱包制品","中英品名":"小钱包/卡包 / wallets purses","材质/用途判断":"箱包","HS6":"4202.32","10位申报":"4202.32.90.90","B3 Duty / MFN":"8%","口径":"口袋/手袋内小容器","id":252,"order":251},{"类别":"皮革/箱包制品","中英品名":"狗狗耳罩/宠物护耳；Dog Earmuffs；Pet Ear Protection；战术手枪套/尼龙工具包；Tactical Pistol Holster；Nylon Utility Pouch；枪套/工具套；holster","材质/用途判断":"材质：塑料、尼龙；用途/关键词：塑料制品、箱包","HS6":"4202.92","10位申报":"4202.92.20.90","B3 Duty / MFN":"10%","口径":"宠物用品；按原始HS 4202.92 归类；箱包；合并自3条同HS记录；关联类别：塑料制品、纺织制品、皮革/箱包制品","id":253,"order":252},{"类别":"皮革/箱包制品","中英品名":"尼龙收纳盒/尼龙收纳袋；Nylon Storage Box；Nylon Storage Bag；PU皮卡包/PU卡包；PU leather card bag；PU card bag；包；bag；孕妇包套装/旅行包套装；Pregnancy bag set；travel bag set；狗/狗牵引绳；Anti break dog traction rope reflective medium and；dog lash；背包/收纳包；backpacks storage bags；背包支撑板；Backpack support plate；自行车包；Bicycle bag","材质/用途判断":"材质：尼龙、皮革/PU；用途/关键词：箱包、皮革/箱包制品","HS6":"4202.92","10位申报":"4202.92.90.00","B3 Duty / MFN":"7%","口径":"箱包；按原始HS 4202.92 归类；宠物用品；类似容器；合并自8条同HS记录；关联类别：纺织制品、皮革/箱包制品","id":254,"order":253},{"类别":"皮革/箱包制品","中英品名":"皮带环/皮带 / belt loop / belt","材质/用途判断":"箱包","HS6":"4203.30","10位申报":"4203.30.00.00","B3 Duty / MFN":"9.5%","口径":"箱包；按原始HS 4203.30 归类","id":255,"order":254},{"类别":"木竹制品","中英品名":"木制餐厨用品 / wooden table kitchenware","材质/用途判断":"木/竹；家具/家居","HS6":"4419.90","10位申报":"4419.90.00.00","B3 Duty / MFN":"6%","口径":"木餐厨","id":256,"order":255},{"类别":"木竹制品","中英品名":"木质装饰盒摆件 / wooden ornaments boxes","材质/用途判断":"木/竹；木竹制品","HS6":"4420.90","10位申报":"4420.90.00.00","B3 Duty / MFN":"7%","口径":"木装饰/盒","id":257,"order":256},{"类别":"木竹制品","中英品名":"木衣架 / Wood hanger","材质/用途判断":"木/竹；服装","HS6":"4421.10","10位申报":"4421.10.00.00","B3 Duty / MFN":"6%","口径":"木制品；按原始HS 4421.10 归类","id":258,"order":257},{"类别":"木竹制品","中英品名":"其他木制品 / other wooden articles","材质/用途判断":"木/竹；家具/家居","HS6":"4421.99","10位申报":"4421.99.90.90","B3 Duty / MFN":"6%","口径":"木杂项","id":259,"order":258},{"类别":"木竹制品","中英品名":"编织纸巾收纳盒；Woven frame tissue storage box；竹/藤编篮筐；basketware wickerwork","材质/用途判断":"材质：纺织面料、纸、木/竹；用途/关键词：纺织制品、木竹制品","HS6":"4602.90","10位申报":"4602.90.90.00","B3 Duty / MFN":"8%","口径":"竹藤编制品；按原始HS 4602.90 归类；编结制品；合并自2条同HS记录；关联类别：纺织制品、木竹制品","id":260,"order":259},{"类别":"木竹制品","中英品名":"木家具 / wooden furniture","材质/用途判断":"木/竹；家具/家居","HS6":"9403.60","10位申报":"9403.60.10.99","B3 Duty / MFN":"9.5%","口径":"家具整件","id":261,"order":260},{"类别":"铝制品","中英品名":"铝餐厨家用品 / aluminium kitchen household articles","材质/用途判断":"铝；铝制品","HS6":"7615.10","10位申报":"7615.10.00.90","B3 Duty / MFN":"6.5%","口径":"铝家用","id":262,"order":261},{"类别":"铝制品","中英品名":"铝卫生用品 / aluminium sanitary ware","材质/用途判断":"铝；铝制品","HS6":"7615.20","10位申报":"7615.20.00.00","B3 Duty / MFN":"6.5%","口径":"铝卫生洁具","id":263,"order":262},{"类别":"铝制品","中英品名":"不锈钢垫片；Stainless Steel Spacers；双头螺栓/钛螺栓/不锈钢螺栓；double screw bolt/Titanium Bolt；stainless steel bolt/double screw bolt；地板螺栓；Floor bolt；直线导轨；Linear Rail Guide；螺母；Screw nut；连接套筒；Connecting sleeve；金属屋顶挡雪装置；Snow protection device for metal roofs","材质/用途判断":"材质：不锈钢、铝；用途/关键词：铝制品、工具/五金","HS6":"7616.10","10位申报":"7616.10.00.90","B3 Duty / MFN":"Free","口径":"铝制品；按原始HS 7616.10 归类；合并自7条同HS记录","id":264,"order":263},{"类别":"铝制品","中英品名":"铝制杂项 / aluminium articles","材质/用途判断":"铝；家具/家居","HS6":"7616.99","10位申报":"7616.99.90.90","B3 Duty / MFN":"6.5%","口径":"铝杂项","id":265,"order":264},{"类别":"铝制品","中英品名":"铝合金开瓶器 / Aluminum alloy corkscrew","材质/用途判断":"铝；工具/五金","HS6":"8210.00","10位申报":"8210.00.90.90","B3 Duty / MFN":"Free","口径":"刀剪餐具；按原始HS 8210.00 归类","id":266,"order":265},{"类别":"铝制品","中英品名":"铝箔球/圣诞球/节日装饰球 / Aluminum Foil Ball/Christmas balls / festivities decoration Ball","材质/用途判断":"铝；玩具/运动","HS6":"9505.10","10位申报":"9505.10.00.90","B3 Duty / MFN":"Free","口径":"节庆用品；按原始HS 9505.10 归类","id":267,"order":266},{"类别":"玻璃制品","中英品名":"镜子 / glass mirrors framed","材质/用途判断":"玻璃；玻璃制品","HS6":"7009.92","10位申报":"7009.92.00.00","B3 Duty / MFN":"Free","口径":"带框镜","id":268,"order":267},{"类别":"玻璃制品","中英品名":"玻璃杯器皿 / glass drinking glasses","材质/用途判断":"玻璃；玻璃制品","HS6":"7013.37","10位申报":"7013.37.00.00","B3 Duty / MFN":"Free","口径":"玻璃饮具","id":269,"order":268},{"类别":"玻璃制品","中英品名":"玻璃餐厨器皿 / glass table kitchenware","材质/用途判断":"玻璃；家具/家居","HS6":"7013.49","10位申报":"7013.49.00.90","B3 Duty / MFN":"Free","口径":"玻璃餐厨","id":270,"order":269},{"类别":"玻璃制品","中英品名":"玻璃风铃 / glass wind chimes","材质/用途判断":"玻璃；玻璃制品","HS6":"7013.99","10位申报":"7013.99.00.90","B3 Duty / MFN":"Free","口径":"玻璃制品；按原始HS 7013.99 归类","id":271,"order":270},{"类别":"玻璃制品","中英品名":"其他玻璃制品 / other glass articles","材质/用途判断":"玻璃；玻璃制品","HS6":"7020.00","10位申报":"7020.00.90.00","B3 Duty / MFN":"6.5%","口径":"玻璃杂项","id":272,"order":271},{"类别":"其他材质/未分类","中英品名":"油漆/清漆 / paints varnishes","材质/用途判断":"其他材质/未分类","HS6":"3208.90","10位申报":"3208.90.90.90","B3 Duty / MFN":"6.5%","口径":"涂料","id":273,"order":272},{"类别":"其他材质/未分类","中英品名":"眼影/彩妆/绘画套装 / Eye shadow / Painting Set","材质/用途判断":"其他材质/未分类","HS6":"3213.10","10位申报":"3213.10.00.00","B3 Duty / MFN":"6.5%","口径":"颜料；按原始HS 3213.10 归类","id":274,"order":273},{"类别":"其他材质/未分类","中英品名":"绘画颜料 / artists colours","材质/用途判断":"其他材质/未分类","HS6":"3213.90","10位申报":"3213.90.90.00","B3 Duty / MFN":"6.5%","口径":"艺术颜料","id":275,"order":274},{"类别":"其他材质/未分类","中英品名":"油墨 / inks","材质/用途判断":"其他材质/未分类","HS6":"3215.90","10位申报":"3215.90.00.00","B3 Duty / MFN":"Free","口径":"墨类","id":276,"order":275},{"类别":"机械器具","中英品名":"信号测量设备 / Signal measuring device","材质/用途判断":"机械器具","HS6":"","10位申报":"","B3 Duty / MFN":"","口径":"机械器具；原始数据未给HS，待补编码","id":277,"order":276},{"类别":"机械器具","中英品名":"水管过滤器 / Water pipe filter","材质/用途判断":"机械器具","HS6":"","10位申报":"","B3 Duty / MFN":"","口径":"机械器具；原始数据未给HS，待补编码","id":278,"order":277},{"类别":"机械器具","中英品名":"水面撇渣器 / Water skimmer","材质/用途判断":"机械器具","HS6":"","10位申报":"","B3 Duty / MFN":"","口径":"机械器具；原始数据未给HS，待补编码","id":279,"order":278},{"类别":"机械器具","中英品名":"灭鼠装置 / Rodenticide device","材质/用途判断":"机械器具","HS6":"","10位申报":"","B3 Duty / MFN":"","口径":"机械器具；原始数据未给HS，待补编码","id":280,"order":279},{"类别":"橡胶制品","中英品名":"橡胶水管带接头 / rubber hose with fittings","材质/用途判断":"橡胶；橡胶制品","HS6":"4009.42","10位申报":"4009.42.00.00","B3 Duty / MFN":"Free","口径":"带接头软管","id":281,"order":280},{"类别":"橡胶制品","中英品名":"橡胶手套 / rubber gloves","材质/用途判断":"橡胶；橡胶制品","HS6":"4015.19","10位申报":"4015.19.90.00","B3 Duty / MFN":"15.5%","口径":"非医疗普通手套","id":282,"order":281},{"类别":"橡胶制品","中英品名":"橡胶垫/地垫 / rubber mats","材质/用途判断":"橡胶；橡胶制品","HS6":"4016.91","10位申报":"4016.91.00.00","B3 Duty / MFN":"7%","口径":"地面覆盖/垫","id":283,"order":282},{"类别":"橡胶制品","中英品名":"橡胶杂项制品 / rubber articles","材质/用途判断":"橡胶；橡胶制品","HS6":"4016.99","10位申报":"4016.99.90.90","B3 Duty / MFN":"6.5%","口径":"普通橡胶杂项","id":284,"order":283},{"类别":"石材/矿物制品","中英品名":"砂轮 / grinding wheel 砂轮","材质/用途判断":"石材/矿物制品","HS6":"6804.22","10位申报":"6804.22.00.00","B3 Duty / MFN":"Free","口径":"化工原料；按原始HS 6804.22 归类","id":285,"order":284},{"类别":"石材/矿物制品","中英品名":"石英石 / Quartz stone","材质/用途判断":"石材/石英；石材/矿物制品","HS6":"6810.99","10位申报":"6810.99.00.00","B3 Duty / MFN":"5%","口径":"化工原料；按原始HS 6810.99 归类","id":286,"order":285},{"类别":"石材/矿物制品","中英品名":"铝制螺丝刀；Aluminum Screwdriver；石膏板膨胀螺丝；Expansion screw for driven gypsum board","材质/用途判断":"材质：铝、石材/石英；用途/关键词：工具/五金、洗护/化工","HS6":"8205.40","10位申报":"8205.40.00.00","B3 Duty / MFN":"7%","口径":"手工具；按原始HS 8205.40 归类；合并自2条同HS记录；关联类别：铝制品、石材/矿物制品","id":287,"order":286},{"类别":"石材/矿物制品","中英品名":"手表 / wrist-watches","材质/用途判断":"石材/石英；电子电器","HS6":"9102.12","10位申报":"9102.12.00.00","B3 Duty / MFN":"5%","口径":"手表","id":288,"order":287},{"类别":"纺织鞋帽","中英品名":"真丝眼罩 / Silk Eye Mask","材质/用途判断":"丝绸；鞋帽","HS6":"6214.90","10位申报":"6214.90.00.00","B3 Duty / MFN":"18%","口径":"服装；按原始HS 6214.90 归类","id":289,"order":288},{"类别":"纺织鞋帽","中英品名":"纺织面鞋 / textile upper footwear","材质/用途判断":"纺织面料；鞋帽","HS6":"6404.19","10位申报":"6404.19.90.00","B3 Duty / MFN":"18%","口径":"普通纺织鞋","id":290,"order":289},{"类别":"纺织鞋帽","中英品名":"帽子；HAT；针织头套面罩/灰色滑雪面罩；Knit Hood Mask/Grey ski mask；Knit Hood Mask","材质/用途判断":"材质：纺织面料；用途/关键词：鞋帽","HS6":"6505.00","10位申报":"6505.00.90.00","B3 Duty / MFN":"15.5%","口径":"帽子；按原始HS 6505.00 归类；合并自2条同HS记录","id":291,"order":290},{"类别":"纺织鞋帽","中英品名":"帽子-针织/钩编 / knitted hats caps","材质/用途判断":"纺织面料；鞋帽","HS6":"6505.00","10位申报":"6505.00.90.90","B3 Duty / MFN":"15.5%","口径":"帽类","id":292,"order":291},{"类别":"车辆配件","中英品名":"机动车通用零件 / motor vehicle parts","材质/用途判断":"机械器具","HS6":"8708.99","10位申报":"8708.99.99.99","B3 Duty / MFN":"6%","口径":"车辆零件","id":293,"order":292},{"类别":"车辆配件","中英品名":"自行车 / bicycles","材质/用途判断":"电子电器","HS6":"8712.00","10位申报":"8712.00.00.00","B3 Duty / MFN":"13%","口径":"整车","id":294,"order":293},{"类别":"车辆配件","中英品名":"婴儿车 / baby carriages","材质/用途判断":"车辆配件","HS6":"8715.00","10位申报":"8715.00.00.00","B3 Duty / MFN":"8%","口径":"婴儿车","id":295,"order":294},{"类别":"车辆配件","中英品名":"婴儿车零件 / baby carriage parts","材质/用途判断":"车辆配件","HS6":"8715.00","10位申报":"8715.00.00.90","B3 Duty / MFN":"8%","口径":"婴儿车零件","id":296,"order":295},{"类别":"陶瓷制品","中英品名":"瓷餐具 / porcelain tableware","材质/用途判断":"陶瓷；家具/家居","HS6":"6911.10","10位申报":"6911.10.90.90","B3 Duty / MFN":"7%","口径":"瓷餐具","id":297,"order":296},{"类别":"陶瓷制品","中英品名":"陶瓷餐厨用品 / ceramic tableware kitchenware","材质/用途判断":"陶瓷；家具/家居","HS6":"6912.00","10位申报":"6912.00.90.10","B3 Duty / MFN":"7%","口径":"陶瓷餐厨","id":298,"order":297},{"类别":"陶瓷制品","中英品名":"陶瓷装饰品 / ceramic ornaments","材质/用途判断":"陶瓷；陶瓷制品","HS6":"6913.90","10位申报":"6913.90.90.00","B3 Duty / MFN":"6.5%","口径":"陶瓷装饰","id":299,"order":298},{"类别":"仪器/医疗用品","中英品名":"OLED显示取景器 / OLED Display Viewfinder","材质/用途判断":"灯具","HS6":"9013.80","10位申报":"9013.80.00.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 9013.80 归类","id":300,"order":299},{"类别":"仪器/医疗用品","中英品名":"九轴模块/开发板套件/模块 / 9 Axised module/Development Board Kit / 9 Axised module part","材质/用途判断":"电子电器","HS6":"9031.90","10位申报":"9031.90.90.90","B3 Duty / MFN":"Free","口径":"机械器具；按原始HS 9031.90 归类","id":301,"order":300},{"类别":"钟表计时","中英品名":"秒表 / stopwatch","材质/用途判断":"钟表计时","HS6":"9101.91","10位申报":"9101.91.10.00","B3 Duty / MFN":"Free","口径":"钟表；按原始HS 9101.91 归类","id":302,"order":301},{"类别":"钟表计时","中英品名":"钟 / clocks","材质/用途判断":"钟表计时","HS6":"9105.21","10位申报":"9105.21.90.00","B3 Duty / MFN":"14%","口径":"钟表","id":303,"order":302},{"类别":"鞋帽伞杖","中英品名":"鞋类零件 / footwear parts","材质/用途判断":"鞋帽","HS6":"6406.90","10位申报":"6406.90.90.00","B3 Duty / MFN":"5%","口径":"鞋配件","id":304,"order":303},{"类别":"鞋帽伞杖","中英品名":"伞 / umbrellas","材质/用途判断":"鞋帽伞杖","HS6":"6601.99","10位申报":"6601.99.00.90","B3 Duty / MFN":"7.5%","口径":"伞类","id":305,"order":304},{"类别":"硅胶制品","中英品名":"硅胶原料 / silicones primary forms","材质/用途判断":"硅胶；硅胶制品","HS6":"3910.00","10位申报":"3910.00.00.00","B3 Duty / MFN":"Free","口径":"初级形态","id":306,"order":305}];

// 数据版本：用于让浏览器自动使用本次清洗后的内置数据，避免旧 localStorage/Firebase 缓存继续显示上一版脏数据。
const DATASET_VERSION = 'merged-duplicate-hs-v8-placeholder-wideedit-2026-06-03';


let allData = [];
let filteredData = [];
let activeFilters = new Set();
let columnOrder = ['类别', '中英品名', '材质/用途判断', 'HS6', '10位申报', 'B3 Duty / MFN', '口径'];

// 同义词和关联词库
const synonyms = {
    '瓶': ['瓶', '罐', '容器', 'bottle', 'flask'],
    '杆': ['杆', '竿', '柱', '棒', 'rod', 'pole'],
    '盖': ['盖', '盖子', '瓶盖', 'cap', 'lid', 'closure'],
    '袋': ['袋', '包装袋', '购物袋', 'bag', 'sack'],
    '箱': ['箱', '盒', '箱子', 'box', 'case', 'carton'],
    '纸': ['纸', '纸张', 'paper'],
    '塑料': ['塑料', '塑胶', 'plastic'],
    '橡胶': ['橡胶', '橡皮', 'rubber'],
    '金属': ['金属', '铁', '钢', '铝', 'metal', 'steel', 'aluminium'],
    '手套': ['手套', 'glove'],
    '笔': ['笔', '书写', 'pen', 'pencil'],
    '本': ['本', '本子', '笔记本', 'notebook', 'book'],
    '标签': ['标签', '吊牌', 'label', 'tag'],
    '印刷': ['印刷', '打印', 'print'],
    '文具': ['文具', '办公', 'stationery', 'office'],
    '家具': ['家具', 'furniture'],
    '厨房': ['厨房', '餐具', 'kitchen', 'tableware'],
    '卫生': ['卫生', '清洁', 'sanitary', 'cleaning']
};

// 材质类别映射
const materialCategories = {
    '塑料': ['塑料制品', '硅胶制品'],
    '硅胶': ['硅胶制品'],
    '橡胶': ['橡胶制品'],
    '纸': ['纸/印刷制品'],
    '布': ['纺织制品', '纺织服装', '纺织鞋帽'],
    '纺织': ['纺织制品', '纺织服装', '纺织鞋帽'],
    '皮革': ['皮革/箱包制品'],
    '玻璃': ['玻璃制品'],
    '陶瓷': ['陶瓷制品'],
    '木': ['木竹制品'],
    '竹': ['木竹制品'],
    '铁': ['钢铁/金属制品'],
    '钢': ['钢铁/金属制品'],
    '不锈钢': ['钢铁/金属制品'],
    '铝': ['铝制品'],
    '铜': ['铜制品'],
    '金属': ['钢铁/金属制品', '铝制品', '铜制品']
};

// 数据版本号 - 每次更新数据时增加这个数字
const DATA_VERSION = 2;


// ========== 自动排序工具 ==========
// 规则：类别条目数多的排前面；同一类别内按 HS code 从小到大排列。
function getItemCategory(item) {
    return (item['类别'] || '').toString().trim() || '未分类';
}

function getCategoryCounts(data = allData) {
    const counts = {};
    data.forEach(item => {
        const category = getItemCategory(item);
        counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
}

function extractHSParts(value) {
    const text = (value || '').toString().trim();
    const match = text.match(/\d+(?:\.\d+)*/);
    if (!match) return null;
    return match[0].split('.').map(part => parseInt(part, 10) || 0);
}

function compareHSCodeValues(a, b) {
    const partsA = extractHSParts(a);
    const partsB = extractHSParts(b);
    
    if (!partsA && !partsB) return 0;
    if (!partsA) return 1;
    if (!partsB) return -1;
    
    const maxLength = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < maxLength; i++) {
        const valueA = partsA[i] ?? 0;
        const valueB = partsB[i] ?? 0;
        if (valueA !== valueB) return valueA - valueB;
    }
    return 0;
}

function getSortableHSCode(item) {
    return item['HS6'] || item['10位申报'] || '';
}

// 新增条目暂存逻辑：
// 新加的空白/未填完条目先固定在最上面，方便连续编辑。
// 当所有可见列都填完后，自动取消暂存状态，并重新进入原来的自动排序。
const NEW_ITEM_DRAFT_FLAG = '__newItemDraft';
const NEW_ITEM_CREATED_AT = '__newItemCreatedAt';
const NEW_ITEM_PLACEHOLDERS = new Set(['', '未分类', '新条目 / new item', 'new item']);

function normalizeCellValueForCompletion(value) {
    return (value ?? '').toString().trim();
}

function isMeaningfulCompletedValue(value) {
    const normalized = normalizeCellValueForCompletion(value);
    return normalized.length > 0 && !NEW_ITEM_PLACEHOLDERS.has(normalized);
}

function isNewDraftComplete(item) {
    return columnOrder.every(col => isMeaningfulCompletedValue(item[col]));
}

function isPendingNewDraft(item) {
    return item && item[NEW_ITEM_DRAFT_FLAG] === true && !isNewDraftComplete(item);
}

function updateNewDraftStatus(item) {
    if (!item || item[NEW_ITEM_DRAFT_FLAG] !== true) return false;
    if (!isNewDraftComplete(item)) return false;

    delete item[NEW_ITEM_DRAFT_FLAG];
    delete item[NEW_ITEM_CREATED_AT];
    return true;
}

function sortDataList(data, categoryCounts = getCategoryCounts(allData)) {
    return [...data].sort((a, b) => {
        const draftA = isPendingNewDraft(a);
        const draftB = isPendingNewDraft(b);
        if (draftA !== draftB) return draftA ? -1 : 1;
        if (draftA && draftB) {
            return (b[NEW_ITEM_CREATED_AT] || 0) - (a[NEW_ITEM_CREATED_AT] || 0);
        }

        const categoryA = getItemCategory(a);
        const categoryB = getItemCategory(b);
        const countDiff = (categoryCounts[categoryB] || 0) - (categoryCounts[categoryA] || 0);
        if (countDiff !== 0) return countDiff;
        
        if (categoryA !== categoryB) {
            return categoryA.localeCompare(categoryB, 'zh-Hans-CN');
        }
        
        const hsDiff = compareHSCodeValues(getSortableHSCode(a), getSortableHSCode(b));
        if (hsDiff !== 0) return hsDiff;
        
        const nameA = (a['中英品名'] || '').toString();
        const nameB = (b['中英品名'] || '').toString();
        return nameA.localeCompare(nameB, 'zh-Hans-CN');
    });
}

function applyAutoSortToAllData() {
    allData.forEach(updateNewDraftStatus);
    allData = sortDataList(allData);
    allData.forEach((item, index) => {
        item.order = index;
    });
}

function escapeHtml(value) {
    return (value ?? '').toString().replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
}

function getCellPlaceholder(col) {
    const placeholders = {
        '类别': '填写类别',
        '中英品名': '填写品名',
        '材质/用途判断': '填写材质/用途',
        'HS6': '填写HS6',
        '10位申报': '填写10位编码',
        'B3 Duty / MFN': '填写税率',
        '口径': '填写口径'
    };
    return placeholders[col] || '填写内容';
}

function renderEditableCell(item, col) {
    const rawValue = item[col] || '';
    const value = rawValue.toString();
    const isEmpty = value.trim() === '';
    const displayValue = isEmpty ? getCellPlaceholder(col) : value;
    const isLong = displayValue.length > 42;
    const isDraftCell = isPendingNewDraft(item);
    return `
        <td class="editable ${isDraftCell ? 'draft-editable' : ''}" data-id="${escapeAttribute(item.id)}" data-field="${escapeAttribute(col)}" ${isDraftCell ? 'onclick="handleDraftCellClick(event, this)"' : ''}>
            <span class="cell-value ${isLong ? 'is-long' : ''} ${isEmpty ? 'is-placeholder' : ''}" title="${escapeAttribute(value)}">${escapeHtml(displayValue)}</span>
            <button class="edit-cell-btn" data-id="${escapeAttribute(item.id)}" data-field="${escapeAttribute(col)}" onclick="event.stopPropagation(); editCell(this.closest('td'), Number(this.dataset.id), this.dataset.field)" title="编辑此字段">✏️</button>
        </td>
    `;
}

function handleDraftCellClick(event, cell) {
    if (!cell || !cell.classList.contains('draft-editable')) return;
    if (event.target.closest('button, input, textarea, .category-autocomplete, .category-option')) return;

    const id = Number(cell.dataset.id);
    const field = cell.dataset.field;
    if (!Number.isFinite(id) || !field) return;

    editCell(cell, id, field);
}

// 初始化 (已合并到 initializeApp)
// function init() {
//     loadData();
//     renderCategoryFilters();
//     renderTableHeader();
//     renderTable();
//     document.getElementById('searchInput').addEventListener('input', handleSearch);
// }

// 生成初始数据（统一补充 id 和 order）
function createInitialData() {
    return initialData.map((item, index) => ({
        ...item,
        id: Date.now() + index,
        order: index
    }));
}

// Firebase Realtime Database 不允许对象 key 包含 . # $ / [ ]
// 所以把整份表格数据转成 JSON 字符串保存，避免列名如“材质/用途判断”“B3 Duty / MFN”导致同步失败。
function createFirebasePayload() {
    return {
        dataJson: JSON.stringify(allData),
        columnsJson: JSON.stringify(columnOrder),
        lastModified: Date.now(),
        schemaVersion: 2,
        datasetVersion: DATASET_VERSION
    };
}

// 兼容读取新版 JSON 字符串格式；如果以后遇到旧格式，也尽量正常读取。
function readFirebasePayload(firebaseData) {
    const isStaleDataset = firebaseData && firebaseData.datasetVersion !== DATASET_VERSION;
    if (isStaleDataset) {
        console.log('⚠️ Firebase 数据版本较旧，使用当前内置数据重建');
        return { data: createInitialData(), columns: columnOrder, isStaleDataset: true };
    }

    let parsedData = createInitialData();
    let parsedColumns = columnOrder;

    try {
        if (firebaseData.dataJson) {
            parsedData = JSON.parse(firebaseData.dataJson);
        } else if (Array.isArray(firebaseData.data)) {
            parsedData = firebaseData.data;
        }
    } catch (error) {
        console.error('❌ Firebase 数据解析失败，改用初始数据:', error);
    }

    try {
        if (firebaseData.columnsJson) {
            parsedColumns = JSON.parse(firebaseData.columnsJson);
        } else if (Array.isArray(firebaseData.columns)) {
            parsedColumns = firebaseData.columns;
        }
    } catch (error) {
        console.error('❌ Firebase 列配置解析失败，改用默认列:', error);
    }

    return {
        data: parsedData,
        columns: parsedColumns,
        isStaleDataset
    };
}

// 加载数据 - 从 Firebase 同步或本地存储
function loadData() {
    if (!firebaseEnabled) {
        // 本地模式
        console.log('📁 使用本地存储模式');
        updateSyncStatus('local');
        loadLocalData();
        return;
    }
    
    console.log('🔄 正在从 Firebase 加载数据...');
    updateSyncStatus('connecting', '正在连接...');
    
    // 先从 Firebase 获取数据
    dataRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            console.log('✅ 从 Firebase 加载数据成功');
            updateSyncStatus('connected', '已连接 · 多人协同');
            
            const parsedFirebaseData = readFirebasePayload(firebaseData);
            allData = parsedFirebaseData.data;
            columnOrder = parsedFirebaseData.columns;
            applyAutoSortToAllData();
            if (parsedFirebaseData.isStaleDataset) {
                saveData();
            }
            
            // 同时保存到本地缓存
            localStorage.setItem('hsCodeData', JSON.stringify(allData));
            localStorage.setItem('hsCodeColumns', JSON.stringify(columnOrder));
            localStorage.setItem('hsCodeDatasetVersion', DATASET_VERSION);
        } else {
            console.log('⚠️ Firebase 中无数据，使用初始数据');
            updateSyncStatus('syncing', '正在初始化...');
            // Firebase 中没有数据，使用初始数据并上传
            allData = createInitialData();
            applyAutoSortToAllData();
            saveData(); // 上传到 Firebase
            updateSyncStatus('connected', '已连接 · 多人协同');
        }
        
        filteredData = [...allData];
        renderCategoryFilters();
        renderTableHeader();
        renderTable();
        
        // 监听 Firebase 数据变化（实时同步）
        setupRealtimeSync();
        
    }).catch((error) => {
        console.error('❌ Firebase 加载失败，使用本地缓存:', error);
        updateSyncStatus('error', '连接失败 · 仅本地');
        loadLocalData();
    });
}

// 从本地存储加载数据
function loadLocalData() {
    const savedData = localStorage.getItem('hsCodeData');
    const savedColumns = localStorage.getItem('hsCodeColumns');
    const savedVersion = localStorage.getItem('hsCodeDatasetVersion');
    const shouldUseSavedData = savedData && savedVersion === DATASET_VERSION;
    
    if (shouldUseSavedData) {
        allData = JSON.parse(savedData);
    } else {
        allData = createInitialData();
        localStorage.setItem('hsCodeDatasetVersion', DATASET_VERSION);
    }
    applyAutoSortToAllData();
    
    if (savedColumns && savedVersion === DATASET_VERSION) {
        columnOrder = JSON.parse(savedColumns);
    }
    
    filteredData = [...allData];
    renderCategoryFilters();
    renderTableHeader();
    renderTable();
}

// 保存数据 - 同步到 Firebase 或本地存储
function saveData() {
    applyAutoSortToAllData();
    // 保存到本地
    localStorage.setItem('hsCodeData', JSON.stringify(allData));
    localStorage.setItem('hsCodeColumns', JSON.stringify(columnOrder));
    localStorage.setItem('hsCodeDatasetVersion', DATASET_VERSION);
    
    // 如果 Firebase 已启用，同步到云端
    if (firebaseEnabled && dataRef) {
        updateSyncStatus('syncing', '正在同步...');
        const dataToSave = createFirebasePayload();
        
        dataRef.set(dataToSave)
            .then(() => {
                console.log('✅ 数据已同步到 Firebase');
                updateSyncStatus('synced', '已同步');
            })
            .catch((error) => {
                console.error('❌ Firebase 同步失败:', error);
                updateSyncStatus('error', '同步失败');
            });
    }
}

// 设置实时同步监听
let isLocalChange = false;
function setupRealtimeSync() {
    if (!firebaseEnabled || !dataRef) return;
    
    dataRef.on('value', (snapshot) => {
        if (isLocalChange) {
            // 如果是本地修改触发的，忽略
            isLocalChange = false;
            return;
        }
        
        if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            console.log('🔄 检测到其他用户的更改，正在同步...');
            
            const parsedFirebaseData = readFirebasePayload(firebaseData);
            allData = parsedFirebaseData.data || allData;
            columnOrder = parsedFirebaseData.columns || columnOrder;
            applyAutoSortToAllData();
            
            // 更新本地缓存
            localStorage.setItem('hsCodeData', JSON.stringify(allData));
            localStorage.setItem('hsCodeColumns', JSON.stringify(columnOrder));
            localStorage.setItem('hsCodeDatasetVersion', DATASET_VERSION);
            
            // 重新渲染
            applyFilters();
            renderCategoryFilters();
            renderTableHeader();
        }
    });
}

// 修改原 saveData，标记为本地修改
const originalSaveData = saveData;
window.saveData = function() {
    isLocalChange = true;
    originalSaveData();
};

// 渲染类别筛选器
function renderCategoryFilters() {
    const categories = new Set();
    allData.forEach(item => {
        if (item['类别']) {
            categories.add(item['类别'].trim());
        }
    });
    
    const filterContainer = document.getElementById('categoryFilters');
    filterContainer.innerHTML = '';
    
    const allTag = document.createElement('div');
    allTag.className = activeFilters.size === 0 ? 'filter-tag active' : 'filter-tag';
    allTag.textContent = '全部';
    allTag.onclick = () => toggleFilter('全部');
    filterContainer.appendChild(allTag);
    
    const categoryCounts = getCategoryCounts(allData);
    Array.from(categories).sort((a, b) => {
        const countDiff = (categoryCounts[b] || 0) - (categoryCounts[a] || 0);
        if (countDiff !== 0) return countDiff;
        return a.localeCompare(b, 'zh-Hans-CN');
    }).forEach(cat => {
        const tag = document.createElement('div');
        tag.className = activeFilters.has(cat) ? 'filter-tag active' : 'filter-tag';
        tag.textContent = cat;
        tag.onclick = () => toggleFilter(cat);
        filterContainer.appendChild(tag);
    });
}

// 切换筛选（单选模式）
function toggleFilter(category) {
    const tags = document.querySelectorAll('.filter-tag');
    
    // 移除所有active状态
    tags.forEach(tag => tag.classList.remove('active'));
    
    // 激活当前点击的标签
    tags.forEach(tag => {
        if (tag.textContent === category) {
            tag.classList.add('active');
        }
    });
    
    // 设置筛选
    if (category === '全部') {
        activeFilters.clear();
    } else {
        activeFilters.clear();
        activeFilters.add(category);
    }
    
    applyFilters();
}

// 应用筛选
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredData = allData.filter(item => {
        if (activeFilters.size > 0) {
            const itemCategory = item['类别'] ? item['类别'].trim() : '';
            if (!activeFilters.has(itemCategory)) return false;
        }
        
        if (searchTerm) {
            const searchableText = columnOrder.map(col => item[col] || '').join(' ').toLowerCase();
            return searchableText.includes(searchTerm);
        }
        
        return true;
    });
    
    filteredData = sortDataList(filteredData, getCategoryCounts(allData));
    
    // 如果有搜索词但没结果，尝试智能推荐
    if (searchTerm && filteredData.length === 0) {
        const suggestions = getSmartSuggestions(searchTerm);
        renderTableWithSuggestions(suggestions);
    } else {
        renderTable();
    }
}

// 搜索处理
function handleSearch() {
    applyFilters();
}

// 渲染表头

function getColumnWidthStyle(col) {
    const widths = {
        '类别': '180px',
        '中英品名': '220px',
        '材质/用途判断': '200px',
        'HS6': '100px',
        '10位申报': '120px',
        'B3 Duty / MFN': '100px',
        '口径': '150px'
    };
    return widths[col] ? ` style="width: ${widths[col]};"` : '';
}

function renderTableHeader() {
    const thead = document.querySelector('#tableHeader');
    thead.innerHTML = `
        <th style="width: 80px;">编号</th>
        ${columnOrder.map(col => `
            <th${getColumnWidthStyle(col)} class="editable-header" data-field="${escapeAttribute(col)}">
                <span class="header-text">${escapeHtml(col)}</span>
                <button class="edit-header-btn" data-field="${escapeAttribute(col)}" onclick="event.stopPropagation(); editHeader(this.parentElement, this.dataset.field)" title="编辑列名">✏️</button>
            </th>
        `).join('')}
        <th style="width: 50px;">操作</th>
    `;
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('dataTable');
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${columnOrder.length + 2}" class="no-results">没有找到匹配的数据</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filteredData.map((item, index) => `
        <tr data-id="${item.id}">
            <td>${index + 1}</td>
            ${columnOrder.map(col => renderEditableCell(item, col)).join('')}
            <td><button class="delete-btn" onclick="deleteItem(${item.id})">🗑️</button></td>
        </tr>
    `).join('');
}

// 智能搜索推荐
function getSmartSuggestions(searchTerm) {
    const suggestions = {
        keywords: new Set(),
        categories: new Set(),
        items: []
    };
    
    // 1. 拆字匹配：提取搜索词中的每个字
    const chars = searchTerm.split('');
    
    // 2. 同义词扩展
    let expandedTerms = [searchTerm];
    for (const [key, values] of Object.entries(synonyms)) {
        if (searchTerm.includes(key) || values.some(v => searchTerm.includes(v))) {
            expandedTerms.push(...values);
        }
    }
    
    // 3. 材质类别推荐
    for (const [keyword, categories] of Object.entries(materialCategories)) {
        if (searchTerm.includes(keyword)) {
            categories.forEach(cat => suggestions.categories.add(cat));
        }
    }
    
    // 4. 遍历所有数据找相关项
    allData.forEach(item => {
        const itemText = columnOrder.map(col => item[col] || '').join(' ').toLowerCase();
        let score = 0;
        
        // 完整词匹配
        if (expandedTerms.some(term => itemText.includes(term))) {
            score += 10;
        }
        
        // 单字匹配
        chars.forEach(char => {
            if (char.length > 0 && itemText.includes(char)) {
                score += 1;
            }
        });
        
        // 类别匹配
        if (suggestions.categories.has(item['类别'])) {
            score += 5;
        }
        
        if (score > 0) {
            suggestions.items.push({ item, score });
            suggestions.keywords.add(item['类别']);
        }
    });
    
    // 按分数排序
    suggestions.items.sort((a, b) => b.score - a.score);
    suggestions.items = suggestions.items.slice(0, 10).map(s => s.item);
    
    return suggestions;
}

// 渲染带推荐的表格
function renderTableWithSuggestions(suggestions) {
    const tbody = document.getElementById('dataTable');
    const searchTerm = document.getElementById('searchInput').value;
    
    let html = `<tr><td colspan="${columnOrder.length + 2}" class="no-results">没有找到"${searchTerm}"的完全匹配</td></tr>`;
    
    if (suggestions.items.length > 0 || suggestions.keywords.size > 0) {
        html += `<tr><td colspan="${columnOrder.length + 2}" style="padding: 0;">
            <div class="search-suggestions">
                <h3>您可能在找...</h3>`;
        
        // 显示相关类别
        if (suggestions.keywords.size > 0) {
            html += `<div style="margin-bottom: 12px;">
                <span style="font-size: 12px; color: #86868b; margin-right: 8px;">相关类别：</span>
                <div class="suggestion-items">`;
            suggestions.keywords.forEach(keyword => {
                html += `<span class="suggestion-item" onclick="searchByKeyword('${keyword}')">${keyword}</span>`;
            });
            html += `</div></div>`;
        }
        
        // 显示推荐条目关键词
        if (suggestions.items.length > 0) {
            const itemKeywords = new Set();
            suggestions.items.forEach(item => {
                const name = item['中英品名'] || '';
                // 提取中文部分的关键词
                const chinesePart = name.split('/')[0].trim();
                const words = chinesePart.split(/\s+/);
                words.forEach(word => {
                    if (word.length >= 2) itemKeywords.add(word);
                });
            });
            
            if (itemKeywords.size > 0) {
                html += `<div>
                    <span style="font-size: 12px; color: #86868b; margin-right: 8px;">试试搜索：</span>
                    <div class="suggestion-items">`;
                Array.from(itemKeywords).slice(0, 8).forEach(keyword => {
                    html += `<span class="suggestion-item" onclick="searchByKeyword('${keyword}')">${keyword}</span>`;
                });
                html += `</div></div>`;
            }
        }
        
        html += `</div></td></tr>`;
        
        // 显示推荐的条目
        if (suggestions.items.length > 0) {
            html += suggestions.items.map((item, index) => `
                <tr style="opacity: 0.7;">
                    <td style="color: #86868b;">${index + 1}</td>
                    ${columnOrder.map(col => renderEditableCell(item, col)).join('')}
                    <td><button class="delete-btn" onclick="deleteItem(${item.id})">🗑️</button></td>
                </tr>
            `).join('');
        }
    }
    
    tbody.innerHTML = html;
}

// 根据关键词搜索
function searchByKeyword(keyword) {
    document.getElementById('searchInput').value = keyword;
    handleSearch();
}

// 编辑单元格

// ========== 类别编辑下拉建议 ==========
const DEFAULT_CATEGORY_OPTIONS = [
    '塑料制品',
    '硅胶制品',
    '橡胶制品',
    '纺织制品',
    '纺织服装',
    '纺织鞋帽',
    '皮革/箱包制品',
    '纸/印刷制品',
    '木竹制品',
    '钢铁/金属制品',
    '铝制品',
    '铜制品',
    '玻璃制品',
    '陶瓷制品',
    '石材/矿物制品',
    '化工/洗护制品',
    '机械/电子电器',
    '机械器具',
    '车辆配件',
    '家具/灯具家居',
    '玩具/运动用品',
    '仪器/医疗用品',
    '钟表计时',
    '鞋帽伞杖',
    '杂项制品',
    '其他材质/未分类'
];

function getCategoryOptions() {
    const counts = {};
    const addOption = (value) => {
        const category = (value || '').toString().trim();
        if (!category) return;
        counts[category] = (counts[category] || 0) + 1;
    };

    DEFAULT_CATEGORY_OPTIONS.forEach(addOption);
    allData.forEach(item => addOption(item['类别']));

    return Object.keys(counts).sort((a, b) => {
        const countDiff = (counts[b] || 0) - (counts[a] || 0);
        if (countDiff !== 0) return countDiff;
        return a.localeCompare(b, 'zh-Hans-CN');
    });
}

function categoryOptionMatches(option, query) {
    const normalizedOption = option.toLowerCase();
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return true;

    return normalizedOption.includes(normalizedQuery) ||
        normalizedOption.replace(/[\/\s-]/g, '').includes(normalizedQuery.replace(/[\/\s-]/g, ''));
}

function createCategoryEditor(cell, input, onSelect) {
    const wrapper = document.createElement('div');
    wrapper.className = 'category-autocomplete';

    const dropdown = document.createElement('div');
    dropdown.className = 'category-dropdown';
    dropdown.setAttribute('role', 'listbox');

    let activeIndex = -1;
    let visibleOptions = [];

    const renderDropdown = () => {
        const query = input.value || '';
        visibleOptions = getCategoryOptions()
            .filter(option => categoryOptionMatches(option, query))
            .slice(0, 12);

        if (visibleOptions.length === 0) {
            dropdown.innerHTML = `<div class="category-option is-empty">没有匹配项，按 Enter 使用当前输入</div>`;
            dropdown.classList.add('show');
            activeIndex = -1;
            return;
        }

        dropdown.innerHTML = visibleOptions.map((option, index) => `
            <button type="button" class="category-option ${index === activeIndex ? 'is-active' : ''}" data-index="${index}">
                ${escapeHtml(option)}
            </button>
        `).join('');

        dropdown.classList.add('show');
    };

    const chooseOption = (option) => {
        input.value = option;
        dropdown.classList.remove('show');
        onSelect();
    };

    dropdown.addEventListener('mousedown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const optionButton = event.target.closest('.category-option[data-index]');
        if (!optionButton) return;

        const option = visibleOptions[Number(optionButton.dataset.index)];
        if (option) chooseOption(option);
    });

    input.addEventListener('input', () => {
        activeIndex = -1;
        renderDropdown();
    });

    input.addEventListener('focus', renderDropdown);

    input.addEventListener('keydown', (event) => {
        if (!dropdown.classList.contains('show')) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (visibleOptions.length === 0) return;
            activeIndex = (activeIndex + 1) % visibleOptions.length;
            renderDropdown();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (visibleOptions.length === 0) return;
            activeIndex = activeIndex <= 0 ? visibleOptions.length - 1 : activeIndex - 1;
            renderDropdown();
        } else if (event.key === 'Enter') {
            if (activeIndex >= 0 && visibleOptions[activeIndex]) {
                event.preventDefault();
                chooseOption(visibleOptions[activeIndex]);
            }
        }
    });

    wrapper.appendChild(input);
    wrapper.appendChild(dropdown);
    cell.appendChild(wrapper);
    renderDropdown();
}


function editCell(cell, id, field) {
    const item = allData.find(i => i.id === id);
    if (!item) return;

    // 如果当前单元格已经处于编辑状态，第二次点击只聚焦输入框，
    // 不要重新创建输入框。否则点击输入框会冒泡到 td，再次触发 editCell，
    // 导致选中内容被重置，看起来像“取消选中/无法编辑”。
    const existingEditor = cell.querySelector('input, textarea');
    if (existingEditor) {
        existingEditor.focus();
        return;
    }

    const originalValue = item[field] || '';
    const isTextarea = field === '中英品名' || field === '材质/用途判断' || field === '口径';
    const isCategoryField = field === '类别';
    let editClosed = false;

    const input = document.createElement(isTextarea ? 'textarea' : 'input');
    if (!isTextarea) input.type = 'text';
    input.value = originalValue;
    input.setAttribute('placeholder', isCategoryField ? '输入或选择类别' : getCellPlaceholder(field));
    if (isCategoryField) {
        input.setAttribute('autocomplete', 'off');
        input.classList.add('category-input');
    }

    // 阻止输入框内的点击继续冒泡到外层 td。
    // 这样第二次点击可以正常定位光标、取消全选或拖选文字。
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('click', (e) => e.stopPropagation());
    input.addEventListener('dblclick', (e) => e.stopPropagation());

    const finishEdit = () => {
        if (editClosed) return;
        editClosed = true;

        const newValue = input.value.trim();
        if (newValue !== originalValue) {
            item[field] = newValue;
            saveData();
            applyFilters();
            renderCategoryFilters();
        } else {
            renderTable();
        }
    };

    const cancelEdit = () => {
        if (editClosed) return;
        editClosed = true;
        input.onblur = null;
        renderTable();
    };

    input.onblur = () => {
        // 类别下拉项使用 mousedown 选择，延迟收起可避免误判为失焦取消点击。
        setTimeout(finishEdit, isCategoryField ? 180 : 0);
    };

    input.onkeydown = (e) => {
        if (e.key === 'Enter' && !isTextarea) {
            e.preventDefault();
            input.blur();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    };

    cell.innerHTML = '';

    if (isCategoryField) {
        createCategoryEditor(cell, input, finishEdit);
    } else {
        cell.appendChild(input);
    }

    input.focus();
    input.select();
}

// 编辑表头
function editHeader(th, oldName) {
    // 防止重复编辑
    if (th.querySelector('input')) return;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldName;
    input.style.width = '100%';
    
    let isSubmitting = false;
    
    const submitEdit = () => {
        if (isSubmitting) return;
        isSubmitting = true;
        
        const newName = input.value.trim();
        if (newName && newName !== oldName) {
            // 检查列名是否已存在
            if (columnOrder.includes(newName)) {
                alert('该列名已存在！');
                renderTableHeader();
                return;
            }
            
            // 更新列顺序
            const index = columnOrder.indexOf(oldName);
            if (index !== -1) {
                columnOrder[index] = newName;
            }
            
            // 更新所有数据中的字段名
            allData = allData.map(item => {
                const newItem = { ...item };
                if (oldName in newItem) {
                    newItem[newName] = newItem[oldName];
                    delete newItem[oldName];
                }
                return newItem;
            });
            
            // 保存并重新渲染
            // 注意：重命名列后 allData 已经被重新生成，filteredData 仍可能指向旧对象。
            // 必须重新执行 applyFilters()，否则表格会用旧 filteredData 渲染，导致新列名下面显示空白。
            saveData();
            renderTableHeader();
            applyFilters();
            renderCategoryFilters();
        } else {
            renderTableHeader();
        }
    };
    
    const cancelEdit = () => {
        if (isSubmitting) return;
        renderTableHeader();
    };
    
    input.onblur = () => {
        // 延迟执行，避免与点击事件冲突
        setTimeout(submitEdit, 100);
    };
    
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    };
    
    th.innerHTML = '';
    th.appendChild(input);
    input.focus();
    input.select();
}

// 添加新列
function addNewColumn() {
    const colName = prompt('请输入新列名称：');
    if (!colName || !colName.trim()) return;
    
    const trimmedName = colName.trim();
    
    if (columnOrder.includes(trimmedName)) {
        alert('该列名已存在！');
        return;
    }
    
    columnOrder.push(trimmedName);
    
    allData = allData.map(item => ({
        ...item,
        [trimmedName]: ''
    }));
    
    saveData();
    renderTableHeader();
    applyFilters();
}

// 删除条目
function deleteItem(id) {
    if (!confirm('确定要删除这条记录吗？')) return;
    
    allData = allData.filter(item => item.id !== id);
    saveData();
    applyFilters();
    renderCategoryFilters();
}

// 添加新条目
function addNewItem() {
    const now = Date.now();
    const newItem = {
        id: now,
        order: -1,
        [NEW_ITEM_DRAFT_FLAG]: true,
        [NEW_ITEM_CREATED_AT]: now
    };
    
    columnOrder.forEach(col => {
        // 新增条目不再写入“未分类 / 新条目”这类真实文字，避免污染数据。
        // 表格里显示的灰色提示由 renderEditableCell() 临时渲染，不会被保存进单元格。
        newItem[col] = '';
    });

    // 新增时回到“全部 + 无搜索”视图，确保新条目一定显示在最上面。
    activeFilters.clear();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    allData.unshift(newItem);
    saveData();
    renderCategoryFilters();
    applyFilters();
}
