Game.settings = (function(){

    var autoSaveMapping = {
        '30secs': 30 * 1000,
        '2mins': 2 * 60 * 1000,
        '10mins': 10 * 60 * 1000,
        'off': 10000000000000000000
    };

    var instance = {
        dataVersion: 1,
        entries: {
            formatter: 'shortName',
            boldEnabled: false,
            sidebarCompressed: false,
            notificationsEnabled: true,
            saveNotifsEnabled: true,
            gainButtonsHidden: false,
            redDestroyButtons: false,
            hideCompleted: false,
            theme: 'base',
            language: 'en',
            autoSaveInterval: 30 * 1000
        },
        elementCache: {},
        reapplyTheme: true
    };

    instance.format = function(value, digit) {
        var format = this.entries.formatter || 'shortName';
        return Game.utils.formatters[format](value.toFixed(digit || 0));
    };

    instance.getEl = function(id) {
        var element = this.elementCache[id];
        if(!element) {
            element = $('#' + id);
            if(element.length > 0) {
                this.elementCache[id] = element;
            }
        }
        return element;
    };

    instance.turnRedOnNegative = function(value, id) {
        var element = this.getEl(id);
        if(element.length === 0) {
            console.error("Element not found: " + id);
            return;
        }

        if(value < 0){
            if(this.entries.boldEnabled === true){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }

            return true;
        }
        else{
            element.removeClass('red bold');
            return false;
        }
    };

    instance.turnRed = function(value, target, id) {
        var element = this.getEl(id);
        if(element.length === 0) {
            console.error("Element not found: " + id);
            return;
        }

        if(value < target){
            if(this.entries.boldEnabled === true){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }
        }
        else{
            element.removeClass('red bold');
        }
    };

    instance.turnRedOrGreen = function(value, target, id) {
        var element = this.getEl(id);
        if(element.length === 0) {
            console.error("Element not found: " + id);
            return;
        }

        if(value === 0){
            if(this.entries.boldEnabled === true){
                element.addClass('red bold');
            } else {
                element.addClass('red');
                element.removeClass('bold');
            }
        }
        else{
            element.removeClass('red bold');
        }

        if(value >= target && target >= 0) {
            element.addClass('green');
        } else {
            element.removeClass('green');
        }
    };

    instance.save = function(data) {
        data.settings = {version: this.dataVersion, entries: {}};
        for(var id in this.entries) {
            data.settings.entries[id] = this.entries[id];
        }
    };

    instance.load = function(data) {
        this.loadLegacy(data);

        console.log(this.entries.hideCompleted)

        if(data.settings) {
            if(data.settings.version && data.settings.version === this.dataVersion) {
                for(var id in data.settings.entries) {
                    this.entries[id] = data.settings.entries[id];
                }
            }
        }

        console.log(this.entries.hideCompleted)

        $('#formatSelector').val(this.entries.formatter);
        $('#themeSelector').val(this.entries.theme);
        $('#boldEnabled').prop('checked', this.entries.boldEnabled);
        $('#sidebarCompressed').prop('checked', this.entries.sidebarCompressed);
        $('#notificationsEnabled').prop('checked', this.entries.notificationsEnabled);
        $('#saveNotifsEnabled').prop('checked', this.entries.saveNotifsEnabled);
        $('#gainButtonsHidden').prop('checked', this.entries.gainButtonsHidden);
        $('#redDestroyButtons').prop('checked', this.entries.redDestroyButtons);
        $('#hideCompleted').prop('checked', this.entries.hideCompleted);
        $('#languageSelector').val(this.entries.language);
        this.applyLanguage();

        if(Game.settings.entries.sidebarCompressed === true){
            for(var i = 0; i < document.getElementsByClassName("sideTab").length; i ++){
                document.getElementsByClassName("sideTab")[i].style.height = "30px";
            }
        }
        else{
            for(var i = 0; i < document.getElementsByClassName("sideTab").length; i ++){
                document.getElementsByClassName("sideTab")[i].style.height = "60px";
            }
        }

        if(Game.settings.entries.gainButtonsHidden === true){
            for(var i = 0; i < document.getElementsByClassName("gainButton").length; i ++){
                document.getElementsByClassName("gainButton")[i].className = "gainButton hidden";
            }
        }
        else{
            for(var i = 0; i < document.getElementsByClassName("gainButton").length; i ++){
                document.getElementsByClassName("gainButton")[i].className = "gainButton";
            }
        }

        if(Game.settings.entries.hideCompleted === true){
            for(var i = 0; i < document.getElementsByClassName("completed").length; i ++){
                document.getElementsByClassName("completed")[i].className = "completed hidden";
            }
        }
        else{
            for(var i = 0; i < document.getElementsByClassName("completed").length; i ++){
                document.getElementsByClassName("completed")[i].className = "completed";
            }
        }
        
        for(var id in autoSaveMapping) {
            var element = $('#' + id);
            if(this.entries.autoSaveInterval === autoSaveMapping[id]) {
                element.val('on');
            } else {
                element.val('off');
            }
        }

        this.reapplyTheme = true;
    };

    // backwards compatibility with the old stats
    instance.loadLegacy = function(data) {
        if(data.currentTheme) { this.set('theme', data.currentTheme); }
    };

    instance.set = function(key, value) {
        this.entries[key] = value;
    };

    instance.initialise = function() {
        $('#formatSelector').change(function(){
            Game.settings.set('formatter', $(this).val());
        });

        $('#themeSelector').change(function(){
            Game.settings.set('theme', $(this).val());
            Game.settings.reapplyTheme = true;
        });

        $('#languageSelector').change(function(){
            var newLang = $(this).val();
            Game.settings.set('language', newLang);
            Game.settings.applyLanguage();
        });

        $('#boldEnabled').change(function(){
            Game.settings.set('boldEnabled', $(this).is(':checked'));
        });

        $('#sidebarCompressed').change(function(){
            Game.settings.set('sidebarCompressed', $(this).is(':checked'));
            if(Game.settings.entries.sidebarCompressed === true){
                for(var i = 0; i < document.getElementsByClassName("sideTab").length; i ++){
                    document.getElementsByClassName("sideTab")[i].style.height = "30px";
                }
            }
            else{
                for(var i = 0; i < document.getElementsByClassName("sideTab").length; i ++){
                    document.getElementsByClassName("sideTab")[i].style.height = "60px";
                }
            }
        });

        $('#notificationsEnabled').change(function(){
            Game.settings.set('notificationsEnabled', $(this).is(':checked'));
        });

        $('#saveNotifsEnabled').change(function(){
            Game.settings.set('saveNotifsEnabled', $(this).is(':checked'));
        });

        $('#gainButtonsHidden').change(function(){
            Game.settings.set('gainButtonsHidden', $(this).is(':checked'));
            if(Game.settings.entries.gainButtonsHidden === true){
                for(var i = 0; i < document.getElementsByClassName("gainButton").length; i ++){
                    document.getElementsByClassName("gainButton")[i].className = "gainButton hidden";
                }
            }
            else{
                for(var i = 0; i < document.getElementsByClassName("gainButton").length; i ++){
                    document.getElementsByClassName("gainButton")[i].className = "gainButton";
                }
            }
        });

        $('#redDestroyButtons').change(function(){
            Game.settings.set('redDestroyButtons', $(this).is(':checked'));
            if (Game.tech.isPurchased('unlockDestruction')) {
                if(Game.settings.entries.redDestroyButtons === true){
                    for(var i = 0; i < document.getElementsByClassName("destroy").length; i ++){
                        document.getElementsByClassName("destroy")[i].className = "btn btn-danger destroy";
                    }
                }
                else{
                    for(var i = 0; i < document.getElementsByClassName("destroy").length; i ++){
                        document.getElementsByClassName("destroy")[i].className = "btn btn-default destroy";
                    }
                }
            }
        });

        if (Game.tech.isUnlocked('unlockDestruction')) {
            if(Game.settings.entries.redDestroyButtons === true){
                for(var i = 0; i < document.getElementsByClassName("destroy").length; i ++){
                    document.getElementsByClassName("destroy")[i].className = "btn btn-danger destroy";
                }
                
            }
            else{
                for(var i = 0; i < document.getElementsByClassName("destroy").length; i ++){
                    document.getElementsByClassName("destroy")[i].className = "btn btn-default destroy";
                }
            }
        }

        $('#hideCompleted').change(function(){
            Game.settings.set('hideCompleted', $(this).is(':checked'));
            if(Game.settings.entries.hideCompleted === true){
                for(var i = 0; i < document.getElementsByClassName("completed").length; i ++){
                    document.getElementsByClassName("completed")[i].className = "completed hidden";
                }
            }
            else{
                for(var i = 0; i < document.getElementsByClassName("completed").length; i ++){
                    document.getElementsByClassName("completed")[i].className = "completed";
                }
            }
        });

        for (var id in autoSaveMapping) {
            var element = $('#' + id);
            element.change({val: autoSaveMapping[id]}, function(args){
                Game.settings.set('autoSaveInterval', args.data.val);
            });
        }
    };

    instance.update = function(delta) {
        if(this.reapplyTheme === true) {
            this.reapplyTheme = false;
            this.updateTheme();
        }
    };

    instance.updateTheme = function() {
        var element = $('#theme_css');

        if(element.length === 0) {
            console.warn("Theme CSS Element does not exist!");
            return;
        }

        if(this.entries.theme === "base") {
            element.attr('href', 'lib/bootstrap.min.css');
        } else {
            element.attr('href', 'styles/' + this.entries.theme + '-bootstrap.min.css');
        }
    };

    instance.translations = {
        en: {
            'nav.resources': 'Resources',
            'nav.research': 'Research',
            'nav.solarSystem': 'Solar System',
            'nav.wonders': 'Wonders',
            'nav.solCenter': 'Sol Center',
            'nav.machines': 'Machines',
            'nav.help': 'Help / FAQ',
            'nav.more': 'More...',
            'settings.graphicsTitle': 'Graphics Options',
            'settings.graphicsDesc': 'You can enable settings to change the interface here.',
            'settings.themeTitle': 'Themes',
            'settings.languageTitle': 'Language',
            'settings.notationTitle': 'Notation',
            'settings.boldEnabled': 'Red Costs: Bold',
            'settings.saveNotifsEnabled': 'Autosave Notifications',
            'settings.notificationsEnabled': 'Screen Notifications',
            'settings.sidebarCompressed': 'Compress Rows in Sidebar to Decrease White Space',
            'settings.gainButtonsHidden': 'Gain Buttons Hidden',
            'settings.redDestroyButtons': 'Destroy Buttons Red',
            'settings.hideCompleted': 'Hidden'
        },
        ko: {
            'nav.resources': '자원',
            'nav.research': '연구',
            'nav.solarSystem': '태양계',
            'nav.wonders': '경이',
            'nav.solCenter': '태양 중심',
            'nav.machines': '기계',
            'nav.help': '도움말 / FAQ',
            'nav.more': '더보기...',
            'settings.graphicsTitle': '그래픽 설정',
            'settings.graphicsDesc': '여기에서 인터페이스를 변경할 수 있는 옵션을 사용 설정하세요.',
            'settings.themeTitle': '테마',
            'settings.languageTitle': '언어',
            'settings.notationTitle': '표기법',
            'settings.boldEnabled': '비용 빨간색: 굵게',
            'settings.saveNotifsEnabled': '자동 저장 알림',
            'settings.notificationsEnabled': '화면 알림',
            'settings.sidebarCompressed': '사이드바 행 압축',
            'settings.gainButtonsHidden': '획득 버튼 숨기기',
            'settings.redDestroyButtons': '파괴 버튼 붉게',
            'settings.hideCompleted': '완료 숨기기'
        }
    };

    instance.applyLanguage = function(lang) {
        lang = lang || this.entries.language || 'en';
        if(!this.translations[lang]) {
            lang = 'en';
        }

        this.entries.language = lang;

        var t = this.translations[lang];
        var setText = function(id, value) {
            var el = document.getElementById(id);
            if(el) { el.textContent = value; }
        };

        setText('navResourcesText', t['nav.resources']);
        setText('navResearchText', t['nav.research']);
        setText('navSolarSystemText', t['nav.solarSystem']);
        setText('navWondersText', t['nav.wonders']);
        setText('navSolCenterText', t['nav.solCenter']);
        setText('navMachinesText', t['nav.machines']);
        setText('navHelpText', t['nav.help']);
        setText('navMoreText', t['nav.more']);
        setText('settingsGraphicsTitle', t['settings.graphicsTitle']);
        setText('settingsGraphicsDesc', t['settings.graphicsDesc']);
        setText('settingsThemeTitle', t['settings.themeTitle']);
        setText('settingsLanguageTitle', t['settings.languageTitle']);
        setText('settingsNotationTitle', t['settings.notationTitle']);
        setText('boldEnabledLabel', t['settings.boldEnabled']);
        setText('saveNotifsEnabledLabel', t['settings.saveNotifsEnabled']);
        setText('notificationsEnabledLabel', t['settings.notificationsEnabled']);
        setText('sidebarCompressedLabel', t['settings.sidebarCompressed']);
        setText('gainButtonsHiddenLabel', t['settings.gainButtonsHidden']);
        setText('redDestroyButtonsLabel', t['settings.redDestroyButtons']);
        setText('hideCompletedLabel', t['settings.hideCompleted']);

        var languageSelector = document.getElementById('languageSelector');
        if(languageSelector) { languageSelector.value = lang; }
    };

    instance.updateCompanyName = function(){
      document.getElementById("companyName").textContent = companyName;
    }

    return instance;

}());
