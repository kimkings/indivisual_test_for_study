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

        if(data.settings) {
            if(data.settings.version && data.settings.version === this.dataVersion) {
                for(var id in data.settings.entries) {
                    this.entries[id] = data.settings.entries[id];
                }
            }
        }

        // localStorage override for immediate language persistence (even without explicit save)
        var storedLanguage = localStorage.getItem('scLanguage');
        if(storedLanguage && this.translations[storedLanguage]) {
            this.entries.language = storedLanguage;
        }

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
            localStorage.setItem('scLanguage', newLang);
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
            'settings.hideCompleted': 'Hidden',
            'settings.english': 'English',
            'settings.korean': 'Korean',
            'subtab.earthResources': 'Earth Resources',
            'subtab.energy': 'Energy',
            'subtab.earth': 'Earth',
            'subtab.innerPlanets': 'Inner Planets',
            'subtab.outerPlanets': 'Outer Planets',
            'subtab.saving': 'Saving',
            'subtab.graphicsOptions': 'Graphics Options',
            'subtab.stats': 'Stats',
            'subtab.achievements': 'Achievements',
            'subtab.donating': 'Donating',
            'subtab.links': 'Links',
            'subtab.gettingStarted': 'Getting Started',
            'subtab.faq': 'FAQ',
            'subtab.credits': 'Credits',
            'subtab.science': 'Science',
            'subtab.technologies': 'Technologies',
            'subtab.rocketFuel': 'Rocket Fuel',
            'subtab.exploration': 'Exploration',
            'subtab.travel': 'Travel',
            'subtab.military': 'Military',
            'machine.batch': 'Batch',
            'machine.add': 'Add',
            'machine.remove': 'Remove',
            'machine.count': 'Count',
            'machine.production': 'Production',
            'resource.plasma': 'Plasma',
            'resource.energy': 'Energy',
            'resource.uranium': 'Uranium',
            'resource.lava': 'Lava',
            'resource.oil': 'Oil',
            'resource.metal': 'Metal',
            'resource.gem': 'Gem',
            'resource.charcoal': 'Charcoal',
            'resource.wood': 'Wood',
            'resource.science': 'Science',
            'resource.silicon': 'Silicon',
            'resource.lunarite': 'Lunarite',
            'resource.methane': 'Methane',
            'resource.titanium': 'Titanium',
            'resource.gold': 'Gold',
            'resource.silver': 'Silver',
            'resource.hydrogen': 'Hydrogen',
            'resource.helium': 'Helium',
            'resource.ice': 'Ice',
            'resource.meteorite': 'Meteorite',
            'resource.rocketFuel': 'Rocket Fuel',
            'resource.metal.desc': 'Metal is one of the primary resources. It is used for many things, including storage upgrades, machinery and most things in space.',
            'resource.energy.desc': 'Energy is created by power sources such as steam engines, solar power and advances even to fusion power and nuclear energy. The maximum you can hold to start with is 100,000 Energy, but batteries are unlockable which can increase this.',
            'resource.plasma.desc': 'Plasma is the 4th state of matter and is used by Tier 4 machines and large space structures as an extreme power source for your company.',
            'resource.oil.desc': 'Oil is pumped up from the ground and is used to build Tier 2 resource gatherers.',
            'resource.gem.desc': 'Gems are one of the primary resources. They are used for advanced machines and for powerful tools and components. They are more useful in later game.',
            'resource.charcoal.desc': 'Charcoal is a secondary tier resource and is used by Engines to produce power for your company. 1 Charcoal is created by burning wood.',
            'resource.wood.desc': 'Wood is one of the primary resources. It is used for many things, including storage upgrades and machinery.',
            'action.gain': 'Gain',
            'ui.storageUpgrade': 'Storage Upgrade',
            'ui.upgradeStorage': 'Upgrade Storage',
            'ui.upgradeYourStorage': 'Upgrade your Metal storage size to',
            'ui.upgradeYourStorageGem': 'Upgrade your Gem storage size to',
            'ui.timeRemainingFull': 'Time remaining until full storage:',
            'ui.costs': 'Costs',
            'ui.produces': 'Produces',
            'ui.theyProduce': 'They produce',
            'ui.theyUse': 'They use',
            'ui.perSecond': 'per second',
            'building.miner.name': 'Miner',
            'building.miner.desc': 'Build a pickaxe for your miner. Produces 1 Metal per second.',
            'building.miner.get': 'Get Miner',
            'building.miner.destroy': 'Destroy Miner',
            'building.heavyDrill.name': 'Heavy Drill',
            'building.heavyDrill.desc': 'Heavy Drills mine Metal at mass. They produce 8 Metal per second. They use 2 Energy per second.',
            'building.heavyDrill.get': 'Get Heavy Drill',
            'building.heavyDrill.destroy': 'Destroy Heavy Drill',
            'building.gigaDrill.name': 'Giga Drill',
            'building.gigaDrill.desc': 'Giga Drills extract Metal at colossal speeds. They produce 108 Metal per second. They use 9 Energy per second.',
            'building.gigaDrill.get': 'Get Giga Drill',
            'building.gigaDrill.destroy': 'Destroy Giga Drill',
            'building.quantumDrill.name': 'Quantum Drill',
            'building.quantumDrill.desc': 'Quantum Drills bend the space-time continuum to get metal faster than conventional methods. They produce 427 Metal per second. They use 24 Energy per second.',
            'building.quantumDrill.get': 'Get Quantum Drill',
            'building.quantumDrill.destroy': 'Destroy Quantum Drill',
            'building.multiDrill.name': 'Multiverse Drill',
            'building.multiDrill.desc': 'Drills metal from alternate realities where metal is plentiful. They produce 4768 Metal per second. They use 131 Energy per second.',
            'building.multiDrill.get': 'Get Multiverse Drill',
            'building.multiDrill.destroy': 'Destroy Multiverse Drill',
            'building.gemMiner.name': 'Gem Miner',
            'building.gemMiner.desc': 'Build an improved pickaxe to mine Gems. Produces 1 Gem per second.',
            'building.gemMiner.get': 'Get Gem Miner',
            'building.gemMiner.destroy': 'Destroy Gem Miner',
            'saving.title': 'Saving',
            'saving.desc': 'This is where you can change how your game is saved.',
            'saving.autoSaveDuration': 'Auto-Save Duration',
            'saving.autoSaveDesc': 'Change how long the game waits before auto-saving again.',
            'saving.30secs': '30 Seconds',
            'saving.2mins': '2 Minutes',
            'saving.10mins': '10 Minutes',
            'saving.off': 'Off',
            'saving.manualSaving': 'Manual Saving',
            'saving.save': 'Save',
            'saving.load': 'Load',
            'saving.hardReset': 'Hard Reset',
            'saving.hardResetWarning': 'Warning: This is non-reversible! Be cautious. There is a confirmation to delete your save.',
            'saving.importExport': 'Import/Export',
            'saving.exportSave': 'Export Save',
            'saving.importSave': 'Import Save',
            'saving.copyToClipboard': 'Copy Text Below To Clipboard',
            'saving.importExportDesc': 'Copy and paste this onto a file somewhere so that you can import it into the game at a later date. You can also use this to create multiple \'savefiles\' of the game by storing multiple instances separately. Make sure there are no spaces at the end when importing.',
            'settings.changeCompanyName': 'Change Company Name',
            'settings.company': 'Company',
            'settings.submit': 'Submit',
            'settings.textDecoration': 'Text Decoration',
            'help.beginnersGuide': 'Beginner\'s Guide',
            'help.beginnersGuideDesc': 'This guide will get you from starting the game to activating your first wonder and will be helpful to grasp everything you need to do. You can refer to this guide at anytime while playing by clicking the Help/FAQ tab in the top right and selecting the Getting Started sub-tab.',
            'help.firstSteps': 'First Steps',
            'help.firstStepsDesc': 'The first thing you can do is start gathering resources. To do this, click the Resources tab near the top left of the screen. This will bring you to the resources display. You can click any of the resources to access its interface, where you can mine the resource yourself by clicking, or you can hire people or build machines to gain those resources for you. While you can hire workers for all three resources, it is recommended to prioritise Metal and Wood in the early stages of the game.',
            'help.researchTitle': 'Research',
            'help.researchDesc': 'To unlock research, you must purchase a metal miner, costing 10 Metal and 5 Wood. This is the first step to idle automation. The Research tab is where you can build laboratories to produce science for you, and also where you can discover and research new technologies to further help you through the game. The first technology you can research is \'Storage Upgrades\', which allows you to build storages to hold more of each type of resource. You can also research \'Basic Energy Production\', which opens up the world of power and advanced machines.',
            'help.balancingResources': 'Balancing Resources & Energy',
            'help.balancingDesc': 'This game has different amounts output by each machine. This can make balancing your resources hard, especially your Energy, Charcoal and Wood as they are consumed by other machines. As a tip, prioritise which resources you should build machines for first - in most cases Metal - and produce the 2 Energy required for a heavy drill. Don\'t upgrade everything to machines at once as you will end up with an Energy deficit. Build up your Charcoal to build engines or increase the number of solar panels to counter this.',
            'help.solarSystemTitle': 'Solar System',
            'help.solarSystemDesc': 'Well, it isn\'t called Space Company for nothing. The first thing needed to unlock inter-planetary exploration is to build a rocket. This is the first large goal that you should aim for. To build a rocket, you need a lot of resources. To launch it requires 20 rocket fuel, which can be made in chemical plants. Once you have 20 Rocket Fuel and have built a rocket, press the launch button to unlock exploration around the solar system and new technologies.',
            'help.moreTitle': 'More',
            'help.moreDesc': 'There are more in-depth explanations and a wider variety of documentation on the Reddit Wiki. Feel free to explore these to learn more about the game, or discover things yourself by playing the game.',
            'faq.title': 'Frequently Asked Questions',
            'faq.desc': 'These are some of the questions that appear the most or that need the most clarifying.',
            'faq.militaryLevel': 'How does the military level work?',
            'faq.militaryLevelDesc': 'The format used is •,••,•••,I,II,III,X,XX,XXX,XXXX,XXXXX,XXXXXX. It is based on the military army hierarchy found on wikipedia.',
            'faq.bug': 'I found a bug! What should I do?',
            'faq.bugDesc': 'If you go to my Github Page, which you can also find in \'More\' Tab, click New Issue and submit it there. Alternatively, you can post/comment about it in r/SpaceCompany, message me on reddit, or go to my discord channel and tell me about it there.',
            'faq.suggestion': 'I have a suggestion for the game',
            'faq.suggestionDesc': 'Similarly to the above, you can go to my Github Page and post a New Issue; you can message me on reddit, put it in a comment on any post at r/SpaceCompany or go to my discord channel and tell me about it there.',
            'faq.updateWhen': 'When will the game be updated next?',
            'faq.updateWhenDesc': 'Well, this isn\'t a full-time project for me. This means that although I will try to work on it as much as I can, progress can be slow. However, I will endeavour to release updates as often as I can and fix any bugs as quickly as possible.',
            'faq.stuck': 'Help, I\'m stuck!',
            'faq.stuckDesc': 'Have you checked all of the tabs to see if there is anything new? Maybe the guide has something about it? If not, feel free to ask me either on reddit or post it as an issue on github if you think there is a problem with the game.',
            'faq.whatDoesThisDo': 'What does this do?',
            'faq.whatDoesThisDoDesc': 'It will probably be self-explanatory, be explained in the description or in the wiki. If not, tell me and I will add it to the item, wiki or to the Frequently Asked Questions page.',
            'faq.wantToHelp': 'I want to help. How do I do that?',
            'faq.wantToHelpDesc': 'Help is always appreciated! You can look over my code in Github and fork it to make changes. Send me a push request, submit an issue or just tell me in reddit and I\'ll most likely be happy to add it in and give credit where due.',
            'faq.donatingGives': 'Does donating give me anything?',
            'faq.donatingGivesDesc': 'No. I didn\'t want to make this game pay-to-win and make people feel that they had to pay money to get further in the game because this makes it less appealing to those who don\'t want to donate.',
            'faq.whereElse': 'Where else can I find the game?',
            'faq.whereElseDesc': 'You can find the game on any of these sites: Reddit: r/spacecompany, GitHub: Game Page, The Plaza: Game',
            'credits.about': 'About',
            'credits.aboutDesc': 'This game is made by me, Sparticle999, as a project to improve my skills at making games and to see what I could add to the incremental gaming world. The content in this game is not always accurate. This is because if it were accurate, many of the elements on other planets would be the same as Earth\'s. Thus, I have had to make up some facts to help my game stay diverse. I apologise for any infuriation caused.',
            'credits.toolsUsed': 'Tools Used',
            'credits.toolsUsedDesc': 'Bootstrap was central to the base design of the game. Bootswatch is the tool that I used to add the different themes to the game. Most of the images are from Shutterstock and retextured and edited by myself to fit the theme of this game.',
            'credits.thankYou': 'Thank you to all Donators and my supporters on Patreon!',
            'machine.energyMachines': 'Energy Machines'
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
            'settings.hideCompleted': '완료 숨기기',
            'settings.english': '영어',
            'settings.korean': '한국어',
            'subtab.earthResources': '지구 자원',
            'subtab.energy': '에너지',
            'subtab.earth': '지구',
            'subtab.innerPlanets': '내행성',
            'subtab.outerPlanets': '외행성',
            'subtab.saving': '저장',
            'subtab.graphicsOptions': '그래픽 설정',
            'subtab.stats': '통계',
            'subtab.achievements': '업적',
            'subtab.donating': '후원',
            'subtab.links': '링크',
            'subtab.gettingStarted': '시작 가이드',
            'subtab.faq': '자주 묻는 질문',
            'subtab.credits': '크레딧',
            'subtab.science': '과학',
            'subtab.technologies': '기술',
            'subtab.rocketFuel': '로켓 연료',
            'subtab.exploration': '탐사',
            'subtab.travel': '이동',
            'subtab.military': '군사',
            'machine.batch': '배수',
            'machine.add': '추가',
            'machine.remove': '제거',
            'machine.count': '보유 수',
            'machine.production': '생산량',
            'resource.plasma': '플라즈마',
            'resource.energy': '에너지',
            'resource.uranium': '우라늄',
            'resource.lava': '용암',
            'resource.oil': '원유',
            'resource.metal': '금속',
            'resource.gem': '보석',
            'resource.charcoal': '목탄',
            'resource.wood': '나무',
            'resource.science': '과학',
            'resource.silicon': '실리콘',
            'resource.lunarite': '루나리트',
            'resource.methane': '메테인',
            'resource.titanium': '티타늄',
            'resource.gold': '금',
            'resource.silver': '은',
            'resource.hydrogen': '수소',
            'resource.helium': '헬륨',
            'resource.ice': '얼음',
            'resource.meteorite': '운석',
            'resource.rocketFuel': '로켓 연료',
            'resource.metal.desc': '금속은 주요 자원 중 하나입니다. 저장소 업그레이드, 기계, 우주 관련 대부분의 것에 사용됩니다.',
            'resource.energy.desc': '에너지는 증기 기관, 태양광, 핵융합, 핵에너지 등 동력원으로 생성됩니다. 초기 최대 보유량은 100,000이며, 배터리 해금으로 늘릴 수 있습니다.',
            'resource.plasma.desc': '플라즈마는 물질의 제4상태로, 4단계 기계와 대형 우주 시설의 고출력 동력원으로 사용됩니다.',
            'resource.oil.desc': '원유는 지하에서 펌핑하며, 2단계 자원 채집기를 만드는 데 사용됩니다.',
            'resource.gem.desc': '보석은 주요 자원 중 하나입니다. 고급 기계와 강력한 도구·부품에 쓰이며, 후반에 더 유용합니다.',
            'resource.charcoal.desc': '목탄은 2단계 자원으로, 엔진에서 회사 동력을 생산하는 데 사용됩니다. 나무 1개를 태우면 목탄 1이 됩니다.',
            'resource.wood.desc': '나무는 주요 자원 중 하나입니다. 저장소 업그레이드와 기계 등 다양한 곳에 사용됩니다.',
            'action.gain': '획득',
            'ui.storageUpgrade': '저장소 업그레이드',
            'ui.upgradeStorage': '저장소 업그레이드',
            'ui.upgradeYourStorage': '금속 저장 한도를 다음으로 올립니다:',
            'ui.upgradeYourStorageGem': '보석 저장 한도를 다음으로 올립니다:',
            'ui.timeRemainingFull': '저장소 가득 찰 때까지:',
            'ui.costs': '비용',
            'ui.produces': '생산량',
            'ui.theyProduce': '초당 생산량',
            'ui.theyUse': '초당 소비',
            'ui.perSecond': '초당',
            'building.miner.name': '채굴기',
            'building.miner.desc': '채굴용 곡괭이를 만듭니다. 초당 금속 1을 생산합니다.',
            'building.miner.get': '채굴기 구매',
            'building.miner.destroy': '채굴기 파괴',
            'building.heavyDrill.name': '중형 드릴',
            'building.heavyDrill.desc': '중형 드릴은 금속을 대량 채굴합니다. 초당 금속 8, 에너지 2 소비.',
            'building.heavyDrill.get': '중형 드릴 구매',
            'building.heavyDrill.destroy': '중형 드릴 파괴',
            'building.gigaDrill.name': '기가 드릴',
            'building.gigaDrill.desc': '기가 드릴은 금속을 엄청난 속도로 채굴합니다. 초당 금속 108, 에너지 9 소비.',
            'building.gigaDrill.get': '기가 드릴 구매',
            'building.gigaDrill.destroy': '기가 드릴 파괴',
            'building.quantumDrill.name': '양자 드릴',
            'building.quantumDrill.desc': '양자 드릴은 시공간을 휘어 기존 방식보다 빠르게 금속을 채굴합니다. 초당 금속 427, 에너지 24 소비.',
            'building.quantumDrill.get': '양자 드릴 구매',
            'building.quantumDrill.destroy': '양자 드릴 파괴',
            'building.multiDrill.name': '멀티버스 드릴',
            'building.multiDrill.desc': '금속이 풍부한 다른 현실에서 금속을 채굴합니다. 초당 금속 4768, 에너지 131 소비.',
            'building.multiDrill.get': '멀티버스 드릴 구매',
            'building.multiDrill.destroy': '멀티버스 드릴 파괴',
            'building.gemMiner.name': '보석 채굴기',
            'building.gemMiner.desc': '보석 채굴용 개량 곡괭이를 만듭니다. 초당 보석 1 생산.',
            'building.gemMiner.get': '보석 채굴기 구매',
            'building.gemMiner.destroy': '보석 채굴기 파괴',
            'saving.title': '저장',
            'saving.desc': '여기서 게임 저장 방식을 변경할 수 있습니다.',
            'saving.autoSaveDuration': '자동 저장 간격',
            'saving.autoSaveDesc': '자동 저장이 다시 실행되기까지 대기하는 시간을 설정합니다.',
            'saving.30secs': '30초',
            'saving.2mins': '2분',
            'saving.10mins': '10분',
            'saving.off': '끄기',
            'saving.manualSaving': '수동 저장',
            'saving.save': '저장',
            'saving.load': '불러오기',
            'saving.hardReset': '완전 초기화',
            'saving.hardResetWarning': '경고: 되돌릴 수 없습니다! 신중히 하세요. 저장 삭제 전 확인 창이 뜹니다.',
            'saving.importExport': '가져오기/내보내기',
            'saving.exportSave': '저장 내보내기',
            'saving.importSave': '저장 가져오기',
            'saving.copyToClipboard': '아래 텍스트를 클립보드에 복사',
            'saving.importExportDesc': '이 내용을 어딘가에 복사해 두었다가 나중에 게임에서 가져오기로 불러올 수 있습니다. 여러 개의 저장 파일을 따로 보관할 수도 있습니다. 가져올 때 끝에 공백이 없도록 주의하세요.',
            'settings.changeCompanyName': '회사 이름 변경',
            'settings.company': '회사',
            'settings.submit': '적용',
            'settings.textDecoration': '글자 꾸미기',
            'help.beginnersGuide': '초보자 가이드',
            'help.beginnersGuideDesc': '이 가이드는 게임을 시작해서 첫 경이를 활성화하기까지 필요한 내용을 담고 있습니다. 플레이 중 언제든 오른쪽 위 도움말/FAQ 탭에서 시작 가이드 서브탭을 선택해 볼 수 있습니다.',
            'help.firstSteps': '첫 걸음',
            'help.firstStepsDesc': '먼저 자원을 모을 수 있습니다. 왼쪽 위의 자원 탭을 클릭하면 자원 화면으로 이동합니다. 각 자원을 클릭해 해당 화면에서 직접 채굴하거나, 사람을 고용하거나 기계를 건설해 자원을 얻을 수 있습니다. 초반에는 금속과 나무에 우선 투자하는 것이 좋습니다.',
            'help.researchTitle': '연구',
            'help.researchDesc': '연구를 열려면 금속 채굴기(금속 10, 나무 5)를 구매해야 합니다. 연구 탭에서 과학을 생산하는 연구소를 짓고, 새로운 기술을 연구해 게임을 진행할 수 있습니다. 가장 먼저 연구할 수 있는 기술은 \'저장소 업그레이드\'로, 각 자원을 더 많이 보관할 수 있게 해 줍니다. \'기본 에너지 생산\'을 연구하면 에너지와 고급 기계의 세계가 열립니다.',
            'help.balancingResources': '자원과 에너지 균형',
            'help.balancingDesc': '각 기계마다 생산량이 달라 자원 균형이 어려울 수 있습니다. 특히 에너지, 목탄, 나무는 다른 기계가 소비하므로 주의하세요. 대부분의 경우 금속 기계를 먼저 올리고, 중형 드릴에 필요한 에너지 2를 확보하세요. 한꺼번에 모든 것을 기계로 바꾸면 에너지 부족이 나므로, 목탄 엔진이나 태양광 패널을 늘려 맞추세요.',
            'help.solarSystemTitle': '태양계',
            'help.solarSystemDesc': '우주 회사라는 이름답게, 행성 간 탐사를 열려면 로켓을 만들어야 합니다. 로켓 제작에 많은 자원이 필요하고, 발사에는 로켓 연료 20이 필요합니다. 로켓 연료는 화학 공장에서 원유와 목탄으로 만들 수 있습니다. 로켓을 완성하고 연료 20을 모으면 발사 버튼을 눌러 태양계 탐사와 새로운 기술을 열 수 있습니다.',
            'help.moreTitle': '더 알아보기',
            'help.moreDesc': '레딧 위키에 더 자세한 설명과 문서가 있습니다. 게임에 대해 더 배우거나 직접 플레이하며 발견해 보세요.',
            'faq.title': '자주 묻는 질문',
            'faq.desc': '가장 자주 나오거나 설명이 많이 필요한 질문들입니다.',
            'faq.militaryLevel': '군사 등급은 어떻게 되나요?',
            'faq.militaryLevelDesc': '표기는 •,••,•••,I,II,III,X,XX,XXX,XXXX,XXXXX,XXXXXX 형식입니다. 위키백과의 군대 계급 구조를 참고했습니다.',
            'faq.bug': '버그를 찾았어요! 어떻게 하면 되나요?',
            'faq.bugDesc': '더보기 탭에서 찾을 수 있는 Github 페이지로 가서 New Issue를 클릭해 제출하세요. 또는 r/SpaceCompany에 글/댓글로 알려주거나, 레딧으로 메시지를 보내거나, 디스코드 채널에서 알려주실 수 있습니다.',
            'faq.suggestion': '게임에 제안할 게 있어요',
            'faq.suggestionDesc': '위와 마찬가지로 Github에서 New Issue를 작성하거나, 레딧으로 메시지를 보내거나, r/SpaceCompany에 댓글이나 글을 남기거나, 디스코드 채널에서 알려주실 수 있습니다.',
            'faq.updateWhen': '다음 업데이트는 언제인가요?',
            'faq.updateWhenDesc': '이 게임은 풀타임 프로젝트가 아니라서 진행이 더딜 수 있습니다. 다만 가능한 한 자주 업데이트하고 버그는 최대한 빨리 수정하려고 합니다.',
            'faq.stuck': '막혔어요!',
            'faq.stuckDesc': '모든 탭을 확인해 보셨나요? 가이드에 도움이 될 내용이 있을 수 있습니다. 없다면 레딧으로 질문하시거나, 게임 문제라고 생각되면 Github에 이슈로 올려 주세요.',
            'faq.whatDoesThisDo': '이건 뭔가요?',
            'faq.whatDoesThisDoDesc': '설명이나 위키에 나와 있을 가능성이 높습니다. 없다면 알려주시면 해당 항목, 위키 또는 FAQ에 추가하겠습니다.',
            'faq.wantToHelp': '도와주고 싶어요. 어떻게 하면 되나요?',
            'faq.wantToHelpDesc': '도움은 언제나 환영합니다! Github에서 코드를 보고 포크해 수정한 뒤 푸시 요청을 보내거나, 이슈를 제출하거나, 레딧으로 알려주시면 반영하고 크레딧을 달아 드리겠습니다.',
            'faq.donatingGives': '후원하면 뭔가 받나요?',
            'faq.donatingGivesDesc': '아니요. 이 게임을 유료 유리하게 만들고 싶지 않아서, 후원하지 않아도 진행에 불이익이 없도록 했습니다.',
            'faq.whereElse': '게임을 다른 곳에서도 할 수 있나요?',
            'faq.whereElseDesc': '다음 사이트에서 게임을 찾을 수 있습니다: Reddit: r/spacecompany, GitHub: 게임 페이지, The Plaza: 게임',
            'credits.about': '소개',
            'credits.aboutDesc': '이 게임은 Sparticle999가 게임 제작 실력을 키우고 점진적 게임에 무엇을 더할 수 있을지 보려고 만든 프로젝트입니다. 내용이 항상 과학적으로 정확한 것은 아닙니다. 정확하게 하면 다른 행성의 자원이 지구와 비슷해지기 때문에, 다양성을 위해 일부는 각색했습니다. 불편을 드려 죄송합니다.',
            'credits.toolsUsed': '사용 도구',
            'credits.toolsUsedDesc': 'Bootstrap이 게임 기본 디자인의 중심입니다. Bootswatch로 다양한 테마를 적용했습니다. 대부분의 이미지는 Shutterstock에서 가져와 게임 테마에 맞게 수정했습니다.',
            'credits.thankYou': '후원해 주신 분들과 Patreon 서포터 분들께 감사드립니다!',
            'machine.energyMachines': '에너지 기계'
        }
    };

    instance.getText = function(key, fallback) {
        var lang = this.entries.language || 'en';
        var pack = this.translations[lang] || this.translations.en;
        return pack[key] || fallback || key;
    };

    instance.applyLanguage = function(lang) {
        lang = lang || this.entries.language || 'en';
        if(!this.translations[lang]) {
            lang = 'en';
        }

        this.entries.language = lang;
        localStorage.setItem('scLanguage', lang);

        // HTML lang attr for browser auto-translate hints
        if(document.documentElement) {
            document.documentElement.lang = lang;
        }

        var t = this.translations[lang];
        var setText = function(id, value) {
            var el = document.getElementById(id);
            if(!el || value === undefined) { return; }

            var labelText = el.querySelector && el.querySelector('.labelText');
            if(labelText) {
                labelText.textContent = value;
                return;
            }

            if(el.tagName && el.tagName.toLowerCase() === 'input') {
                if(el.placeholder !== undefined) {
                    el.placeholder = value;
                } else {
                    el.value = value;
                }
                return;
            }

            // preserve checkbox/input inside label if no .labelText child
            if(el.querySelector && el.querySelector('input[type="checkbox"]')) {
                var span = el.querySelector('.labelText');
                if(!span) {
                    span = document.createElement('span');
                    span.className = 'labelText';
                    el.appendChild(span);
                }
                span.textContent = value;
                return;
            }

            el.textContent = value;
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

        // Apply translation to all data-i18n nodes (extensible content translation)
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if(!key || !t[key]) { return; }
            if(el.tagName.toLowerCase() === 'input') {
                if(el.placeholder !== undefined) {
                    el.placeholder = t[key];
                } else {
                    el.value = t[key];
                }
            } else if(el.querySelector && el.querySelector('.labelText')) {
                setText(el.id, t[key]);
            } else {
                el.textContent = t[key];
            }
        });

        document.querySelectorAll('[data-lang-key]').forEach(function(el) {
            var key = el.getAttribute('data-lang-key');
            if(!key || !t[key]) { return; }
            if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'radio') { el.value = t[key]; }
            else { el.textContent = t[key]; }
        });

        var languageSelector = document.getElementById('languageSelector');
        if(languageSelector) { languageSelector.value = lang; }
        var englishOption = languageSelector && languageSelector.querySelector('option[value="en"]');
        var koreanOption = languageSelector && languageSelector.querySelector('option[value="ko"]');
        if(englishOption) { englishOption.textContent = t['settings.english']; }
        if(koreanOption) { koreanOption.textContent = t['settings.korean']; }
    };

    instance.updateCompanyName = function(){
      document.getElementById("companyName").textContent = companyName;
    }

    return instance;

}());
