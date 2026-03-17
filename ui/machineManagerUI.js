Game.machineManagerUI = (function() {

    var instance = {};

    instance.batchAmount = 1;
    instance.root = null;
    instance.machineLookup = {};

    instance.categories = [
        {
            id: 'machineEnergyTab',
            title: 'Energy',
            resources: [
                {
                    id: 'plasma',
                    title: 'Plasma',
                    machines: [
                        { id: 'heater', name: 'Super-Heater', getter: 'getHeater', outputVar: 'heaterOutput', countVar: 'heater' },
                        { id: 'plasmatic', name: 'Plasmatic Pit', getter: 'getPlasmatic', outputVar: 'plasmaticOutput', countVar: 'plasmatic' },
                        { id: 'bath', name: 'Electron Bath', getter: 'getBath', outputVar: 'bathOutput', countVar: 'bath' }
                    ]
                },
                {
                    id: 'energy',
                    title: 'Energy',
                    machines: [
                        { id: 'charcoalEngine', name: 'Charcoal Engine', getter: 'getCharcoalEngine', outputVar: 'charcoalEngineOutput', countVar: 'charcoalEngine' },
                        { id: 'solarPanel', name: 'Solar Panel', getter: 'getSolarPanel', outputVar: 'solarPanelOutput', countVar: 'solarPanel' },
                        { id: 'methaneStation', name: 'Methane Power Station', getter: 'getMethaneStation', outputVar: 'methaneStationOutput', countVar: 'methaneStation' },
                        { id: 'nuclearStation', name: 'Nuclear Power Station', getter: 'getNuclearStation', outputVar: 'nuclearStationOutput', countVar: 'nuclearStation' },
                        { id: 'magmatic', name: 'Magmatic Dynamo', getter: 'getMagmatic', outputVar: 'magmaticOutput', countVar: 'magmatic' },
                        { id: 'fusionReactor', name: 'Fusion Reactor', getter: 'getFusionReactor', outputVar: 'fusionReactorOutput', countVar: 'fusionReactor' },
                        { id: 'singularityReactor', name: 'Singularity Reactor', getter: 'getSingularityReactor', outputVar: 'singularityReactorOutput', countVar: 'singularityReactor' }
                    ]
                },
                {
                    id: 'uranium',
                    title: 'Uranium',
                    machines: [
                        { id: 'grinder', name: 'Grinder', getter: 'getGrinder', outputVar: 'grinderOutput', countVar: 'grinder' },
                        { id: 'cubic', name: 'Cubic Teleposer', getter: 'getCubic', outputVar: 'cubicOutput', countVar: 'cubic' },
                        { id: 'enricher', name: 'Uranium Enricher', getter: 'getEnricher', outputVar: 'enricherOutput', countVar: 'enricher' },
                        { id: 'recycler', name: 'Yellowcake Recycler', getter: 'getRecycler', outputVar: 'recyclerOutput', countVar: 'recycler' },
                        { id: 'planetNuke', name: 'Planetary Nuclear Plant', getter: 'getPlanetNuke', outputVar: 'planetNukeOutput', countVar: 'planetNuke' }
                    ]
                },
                {
                    id: 'lava',
                    title: 'Lava',
                    machines: [
                        { id: 'crucible', name: 'Heat Resistant Crucible', getter: 'getCrucible', outputVar: 'crucibleOutput', countVar: 'crucible' },
                        { id: 'extractor', name: 'Lava Extractor', getter: 'getExtractor', outputVar: 'extractorOutput', countVar: 'extractor' },
                        { id: 'extruder', name: 'Igneous Extruder', getter: 'getExtruder', outputVar: 'extruderOutput', countVar: 'extruder' },
                        { id: 'veluptuator', name: 'Volcanic Veluptuator', getter: 'getVeluptuator', outputVar: 'veluptuatorOutput', countVar: 'veluptuator' },
                        { id: 'condensator', name: 'Jupitonian Condensator', getter: 'getCondensator', outputVar: 'condensatorOutput', countVar: 'condensator' }
                    ]
                }
            ]
        },
        {
            id: 'machineEarthTab',
            title: 'Earth',
            resources: [
                {
                    id: 'oil',
                    title: 'Oil',
                    machines: [
                        { id: 'pump', name: 'Small Pump', getter: 'getPump', outputVar: 'pumpOutput', countVar: 'pump' },
                        { id: 'pumpjack', name: 'Pumpjack', getter: 'getPumpjack', outputVar: 'pumpjackOutput', countVar: 'pumpjack' },
                        { id: 'oilField', name: 'Oil Field', getter: 'getOilField', outputVar: 'oilFieldOutput', countVar: 'oilField' },
                        { id: 'oilRig', name: 'Offshore Rig', getter: 'getOilRig', outputVar: 'oilRigOutput', countVar: 'oilRig' },
                        { id: 'fossilator', name: 'Fossilator 9000', getter: 'getFossilator', outputVar: 'fossilatorOutput', countVar: 'fossilator' }
                    ]
                },
                {
                    id: 'metal',
                    title: 'Metal',
                    machines: [
                        { id: 'miner', name: 'Miner', getter: 'getMiner', outputVar: 'minerOutput', countVar: 'miner' },
                        { id: 'heavyDrill', name: 'Heavy Drill', getter: 'getHeavyDrill', outputVar: 'heavyDrillOutput', countVar: 'heavyDrill' },
                        { id: 'gigaDrill', name: 'Giga Drill', getter: 'getGigaDrill', outputVar: 'gigaDrillOutput', countVar: 'gigaDrill' },
                        { id: 'quantumDrill', name: 'Quantum Drill', getter: 'getQuantumDrill', outputVar: 'quantumDrillOutput', countVar: 'quantumDrill' },
                        { id: 'multiDrill', name: 'Multiverse Drill', getter: 'getMultiDrill', outputVar: 'multiDrillOutput', countVar: 'multiDrill' }
                    ]
                },
                {
                    id: 'gem',
                    title: 'Gem',
                    machines: [
                        { id: 'gemMiner', name: 'Gem Miner', getter: 'getGemMiner', outputVar: 'gemMinerOutput', countVar: 'gemMiner' },
                        { id: 'advancedDrill', name: 'Advanced Drill', getter: 'getAdvancedDrill', outputVar: 'advancedDrillOutput', countVar: 'advancedDrill' },
                        { id: 'diamondDrill', name: 'Diamond Drill', getter: 'getDiamondDrill', outputVar: 'diamondDrillOutput', countVar: 'diamondDrill' },
                        { id: 'carbyneDrill', name: 'Carbyne Drill', getter: 'getCarbyneDrill', outputVar: 'carbyneDrillOutput', countVar: 'carbyneDrill' },
                        { id: 'diamondChamber', name: 'Diamond Accretion Chamber', getter: 'getDiamondChamber', outputVar: 'diamondChamberOutput', countVar: 'diamondChamber' }
                    ]
                },
                {
                    id: 'charcoal',
                    title: 'Charcoal',
                    machines: [
                        { id: 'woodburner', name: 'Woodburner', getter: 'getWoodburner', outputVar: 'woodburnerOutput', countVar: 'woodburner' },
                        { id: 'furnace', name: 'Furnace', getter: 'getFurnace', outputVar: 'furnaceOutput', countVar: 'furnace' },
                        { id: 'kiln', name: 'Industrial Kiln', getter: 'getKiln', outputVar: 'kilnOutput', countVar: 'kiln' },
                        { id: 'fryer', name: 'Forest Fryer', getter: 'getFryer', outputVar: 'fryerOutput', countVar: 'fryer' },
                        { id: 'microPollutor', name: 'Microverse Pollutor', getter: 'getMicroPollutor', outputVar: 'microPollutorOutput', countVar: 'microPollutor' }
                    ]
                },
                {
                    id: 'wood',
                    title: 'Wood',
                    machines: [
                        { id: 'woodcutter', name: 'Woodcutter', getter: 'getWoodcutter', outputVar: 'woodcutterOutput', countVar: 'woodcutter' },
                        { id: 'laserCutter', name: 'Laser Cutter', getter: 'getLaserCutter', outputVar: 'laserCutterOutput', countVar: 'laserCutter' },
                        { id: 'deforester', name: 'Mass Deforester', getter: 'getDeforester', outputVar: 'deforesterOutput', countVar: 'deforester' },
                        { id: 'infuser', name: 'Biomass Infuser', getter: 'getInfuser', outputVar: 'infuserOutput', countVar: 'infuser' },
                        { id: 'forest', name: 'Russian Forest', getter: 'getForest', outputVar: 'forestOutput', countVar: 'forest' }
                    ]
                },
                {
                    id: 'science',
                    title: 'Science',
                    machines: [
                        { id: 'lab', name: 'Home Science Kit', getter: 'getLab', outputVar: 'labOutput', countVar: 'lab' },
                        { id: 'labT2', name: 'High School Science', getter: 'getLabT2', outputVar: 'labT2Output', countVar: 'labT2' },
                        { id: 'labT3', name: 'University Laboratory', getter: 'getLabT3', outputVar: 'labT3Output', countVar: 'labT3' },
                        { id: 'labT4', name: 'Scientific Institution', getter: 'getLabT4', outputVar: 'labT4Output', countVar: 'labT4' },
                        { id: 'labT5', name: 'Research Laboratory', getter: 'getLabT5', outputVar: 'labT5Output', countVar: 'labT5' }
                    ]
                }
            ]
        },
        {
            id: 'machineInnerTab',
            title: 'Inner Planets',
            resources: [
                {
                    id: 'silicon',
                    title: 'Silicon',
                    machines: [
                        { id: 'blowtorch', name: 'Empowered Blowtorch', getter: 'getBlowtorch', outputVar: 'blowtorchOutput', countVar: 'blowtorch' },
                        { id: 'scorcher', name: 'Scorcher', getter: 'getScorcher', outputVar: 'scorcherOutput', countVar: 'scorcher' },
                        { id: 'annihilator', name: 'Beach Annihilator', getter: 'getAnnihilator', outputVar: 'annihilatorOutput', countVar: 'annihilator' },
                        { id: 'desert', name: 'Desert Destroyer', getter: 'getDesert', outputVar: 'desertOutput', countVar: 'desert' },
                        { id: 'tardis', name: 'T.A.R.D.I.S.', getter: 'getTardis', outputVar: 'tardisOutput', countVar: 'tardis' }
                    ]
                },
                {
                    id: 'lunarite',
                    title: 'Lunarite',
                    machines: [
                        { id: 'moonWorker', name: 'Moon Worker', getter: 'getMoonWorker', outputVar: 'moonWorkerOutput', countVar: 'moonWorker' },
                        { id: 'moonDrill', name: 'Low-Gravity Drill', getter: 'getMoonDrill', outputVar: 'moonDrillOutput', countVar: 'moonDrill' },
                        { id: 'moonQuarry', name: 'Moon Quarry', getter: 'getMoonQuarry', outputVar: 'moonQuarryOutput', countVar: 'moonQuarry' },
                        { id: 'planetExcavator', name: 'Planetary Excavator', getter: 'getPlanetExcavator', outputVar: 'planetExcavatorOutput', countVar: 'planetExcavator' },
                        { id: 'cloner', name: 'Moon Cloner', getter: 'getCloner', outputVar: 'clonerOutput', countVar: 'cloner' }
                    ]
                },
                {
                    id: 'methane',
                    title: 'Methane',
                    machines: [
                        { id: 'vacuum', name: 'Vacuum Cleaner', getter: 'getVacuum', outputVar: 'vacuumOutput', countVar: 'vacuum' },
                        { id: 'suctionExcavator', name: 'Suction Excavator', getter: 'getSuctionExcavator', outputVar: 'suctionExcavatorOutput', countVar: 'suctionExcavator' },
                        { id: 'spaceCow', name: 'Space Cow', getter: 'getSpaceCow', outputVar: 'spaceCowOutput', countVar: 'spaceCow' },
                        { id: 'vent', name: 'Hydrothermal Vent', getter: 'getVent', outputVar: 'ventOutput', countVar: 'vent' },
                        { id: 'interCow', name: 'Interstellar Cow', getter: 'getInterCow', outputVar: 'interCowOutput', countVar: 'interCow' }
                    ]
                },
                {
                    id: 'titanium',
                    title: 'Titanium',
                    machines: [
                        { id: 'explorer', name: 'Explorer', getter: 'getExplorer', outputVar: 'explorerOutput', countVar: 'explorer' },
                        { id: 'lunariteDrill', name: 'Lunarite Drill', getter: 'getLunariteDrill', outputVar: 'lunariteDrillOutput', countVar: 'lunariteDrill' },
                        { id: 'pentaDrill', name: 'Penta-Drill', getter: 'getPentaDrill', outputVar: 'pentaDrillOutput', countVar: 'pentaDrill' },
                        { id: 'titanDrill', name: 'Titan-Drill', getter: 'getTitanDrill', outputVar: 'titanDrillOutput', countVar: 'titanDrill' },
                        { id: 'club', name: 'David Guetta\'s Club', getter: 'getClub', outputVar: 'clubOutput', countVar: 'club' }
                    ]
                },
                {
                    id: 'gold',
                    title: 'Gold',
                    machines: [
                        { id: 'droid', name: 'Rocket Droid', getter: 'getDroid', outputVar: 'droidOutput', countVar: 'droid' },
                        { id: 'destroyer', name: 'Asteroid Destroyer', getter: 'getDestroyer', outputVar: 'destroyerOutput', countVar: 'destroyer' },
                        { id: 'deathStar', name: 'Death Star Jr', getter: 'getDeathStar', outputVar: 'deathStarOutput', countVar: 'deathStar' },
                        { id: 'actuator', name: 'Chronal Actuator', getter: 'getActuator', outputVar: 'actuatorOutput', countVar: 'actuator' },
                        { id: 'philosopher', name: 'Philosopher\'s Stone', getter: 'getPhilosopher', outputVar: 'philosopherOutput', countVar: 'philosopher' }
                    ]
                },
                {
                    id: 'silver',
                    title: 'Silver',
                    machines: [
                        { id: 'scout', name: 'Scout', getter: 'getScout', outputVar: 'scoutOutput', countVar: 'scout' },
                        { id: 'spaceLaser', name: 'Space Laser', getter: 'getSpaceLaser', outputVar: 'spaceLaserOutput', countVar: 'spaceLaser' },
                        { id: 'bertha', name: 'Big Bertha', getter: 'getBertha', outputVar: 'berthaOutput', countVar: 'bertha' },
                        { id: 'cannon', name: 'Atomic Cannon', getter: 'getCannon', outputVar: 'cannonOutput', countVar: 'cannon' },
                        { id: 'werewolf', name: 'Dead Werewolf Finder', getter: 'getWerewolf', outputVar: 'werewolfOutput', countVar: 'werewolf' }
                    ]
                }
            ]
        },
        {
            id: 'machineOuterTab',
            title: 'Outer Planets',
            resources: [
                {
                    id: 'hydrogen',
                    title: 'Hydrogen',
                    machines: [
                        { id: 'collector', name: 'Collector', getter: 'getCollector', outputVar: 'collectorOutput', countVar: 'collector' },
                        { id: 'magnet', name: 'Gaseous Magnet', getter: 'getMagnet', outputVar: 'magnetOutput', countVar: 'magnet' },
                        { id: 'eCell', name: 'Electrolytic Cell', getter: 'getECell', outputVar: 'eCellOutput', countVar: 'eCell' },
                        { id: 'hindenburg', name: 'Hindenburg Excavation', getter: 'getHindenburg', outputVar: 'hindenburgOutput', countVar: 'hindenburg' },
                        { id: 'harvester', name: 'Star Harvester', getter: 'getHarvester', outputVar: 'harvesterOutput', countVar: 'harvester' }
                    ]
                },
                {
                    id: 'helium',
                    title: 'Helium',
                    machines: [
                        { id: 'drone', name: 'Helium Drone', getter: 'getDrone', outputVar: 'droneOutput', countVar: 'drone' },
                        { id: 'tanker', name: 'Helium Tanker', getter: 'getTanker', outputVar: 'tankerOutput', countVar: 'tanker' },
                        { id: 'compressor', name: 'Morphic Compressor', getter: 'getCompressor', outputVar: 'compressorOutput', countVar: 'compressor' },
                        { id: 'skimmer', name: 'Gas Giant Skimmer', getter: 'getSkimmer', outputVar: 'skimmerOutput', countVar: 'skimmer' },
                        { id: 'cage', name: 'Caged Star', getter: 'getCage', outputVar: 'cageOutput', countVar: 'cage' }
                    ]
                },
                {
                    id: 'ice',
                    title: 'Ice',
                    machines: [
                        { id: 'icePick', name: 'Ice Pickaxe', getter: 'getIcePick', outputVar: 'icePickOutput', countVar: 'icePick' },
                        { id: 'iceDrill', name: 'Ice Drill', getter: 'getIceDrill', outputVar: 'iceDrillOutput', countVar: 'iceDrill' },
                        { id: 'freezer', name: 'Ocean Freezer', getter: 'getFreezer', outputVar: 'freezerOutput', countVar: 'freezer' },
                        { id: 'mrFreeze', name: 'Mr Freeze', getter: 'getMrFreeze', outputVar: 'mrFreezeOutput', countVar: 'mrFreeze' },
                        { id: 'overexchange', name: 'Overexchange Condenser', getter: 'getOverexchange', outputVar: 'overexchangeOutput', countVar: 'overexchange' }
                    ]
                },
                {
                    id: 'meteorite',
                    title: 'Meteorite',
                    machines: [
                        { id: 'printer', name: 'Meteorite Printer', getter: 'getPrinter', outputVar: 'printerOutput', countVar: 'printer' },
                        { id: 'web', name: 'Meteorite Web', getter: 'getWeb', outputVar: 'webOutput', countVar: 'web' },
                        { id: 'smasher', name: 'Planet Smasher', getter: 'getSmasher', outputVar: 'smasherOutput', countVar: 'smasher' },
                        { id: 'nebulous', name: 'Nebulous Synthesizer', getter: 'getNebulous', outputVar: 'nebulousOutput', countVar: 'nebulous' }
                    ]
                },
                {
                    id: 'rocketFuel',
                    title: 'Rocket Fuel',
                    machines: [
                        { id: 'chemicalPlant', name: 'Chemical Plant', getter: 'getChemicalPlant', outputVar: 'chemicalPlantOutput', countVar: 'chemicalPlant' },
                        { id: 'oxidisation', name: 'Oxidisation Chamber', getter: 'getOxidisation', outputVar: 'oxidisationOutput', countVar: 'oxidisation' },
                        { id: 'hydrazine', name: 'Hydrazine Catalyst', getter: 'getHydrazine', outputVar: 'hydrazineOutput', countVar: 'hydrazine' }
                    ]
                }
            ]
        }
    ];

    instance.initialise = function() {
        this.root = document.getElementById('machineTab');
        if (!this.root) {
            return;
        }

        this.buildLookup();
        this.renderShell();
        this.attachEvents();
        this.renderPanels();
        this.setBatchAmount(this.batchAmount);
        this.selectCategory(this.categories[0].id);
        this.refresh();
    };

    instance.update = function() {
        this.refresh();
    };

    instance.buildLookup = function() {
        this.machineLookup = {};
        for (var i = 0; i < this.categories.length; i++) {
            var category = this.categories[i];
            for (var j = 0; j < category.resources.length; j++) {
                var resource = category.resources[j];
                for (var k = 0; k < resource.machines.length; k++) {
                    var machine = resource.machines[k];
                    machine.resourceId = resource.id;
                    this.machineLookup[machine.id] = machine;
                }
            }
        }
    };

    instance.renderShell = function() {
        var html = [
            '<div class="container" style="width:220px; padding:0; float:left;">',
                '<table class="table table-hover text-primary no-select pointer" id="machineManagerNav">'
        ];

        for (var i = 0; i < this.categories.length; i++) {
            html.push(
                '<tr class="sideTab machine-manager-nav-row" data-machine-pane="' + this.categories[i].id + '">',
                    '<td style="border:none; vertical-align:middle;"><span data-lang-key="' + this.getCategoryLangKey(this.categories[i].title) + '">' + this.getCategoryTitle(this.categories[i].title) + '</span></td>',
                '</tr>'
            );
        }

        html.push(
                '</table>',
            '</div>',
            '<div class="tab-content" id="machineManagerContent">'
        );

        for (var j = 0; j < this.categories.length; j++) {
            html.push(
                '<div id="' + this.categories[j].id + '" class="machine-manager-pane">',
                    '<div class="container" style="max-width:900px;">',
                        '<div class="machine-manager-toolbar">',
                            '<label for="machineBatchSelect_' + this.categories[j].id + '" data-lang-key="machine.batch">' + Game.settings.getText('machine.batch', 'Batch') + '</label>',
                            '<select id="machineBatchSelect_' + this.categories[j].id + '" class="form-control machine-batch-select">',
                                '<option value="1">x1</option>',
                                '<option value="10">x10</option>',
                                '<option value="100">x100</option>',
                            '</select>',
                        '</div>',
                        '<div id="' + this.categories[j].id + '_content"></div>',
                    '</div>',
                '</div>'
            );
        }

        html.push('</div>');
        this.root.innerHTML = html.join('');
    };

    instance.attachEvents = function() {
        var self = this;
        var navRows = this.root.querySelectorAll('.machine-manager-nav-row');
        for (var i = 0; i < navRows.length; i++) {
            navRows[i].onclick = function() {
                self.selectCategory(this.getAttribute('data-machine-pane'));
            };
        }

        var selects = this.root.querySelectorAll('.machine-batch-select');
        for (var j = 0; j < selects.length; j++) {
            selects[j].onchange = function() {
                self.setBatchAmount(parseInt(this.value, 10) || 1);
            };
        }
    };

    instance.renderPanels = function() {
        for (var i = 0; i < this.categories.length; i++) {
            var category = this.categories[i];
            var parts = [];
            for (var j = 0; j < category.resources.length; j++) {
                var resource = category.resources[j];
                parts.push('<div class="machine-resource-group">');
                parts.push('<h3 class="machine-resource-title" data-lang-key="resource.' + resource.id + '">' + Game.settings.getText('resource.' + resource.id, resource.title) + '</h3>');
                for (var k = 0; k < resource.machines.length; k++) {
                    var machine = resource.machines[k];
                    parts.push(
                        '<div class="machine-manager-row" id="machineRow_' + machine.id + '">',
                            '<div class="machine-manager-main">',
                                '<span class="machine-manager-name">' + machine.name + '</span>',
                                '<span class="machine-manager-stats">',
                                    '<span data-lang-key="machine.count">' + Game.settings.getText('machine.count', 'Count') + '</span>: <span id="machineCount_' + machine.id + '">0</span> | ',
                                    '<span data-lang-key="machine.production">' + Game.settings.getText('machine.production', 'Production') + '</span>: <span id="machineProd_' + machine.id + '">0/sec</span>',
                                '</span>',
                            '</div>',
                            '<div class="machine-manager-actions">',
                                '<button class="btn btn-default" data-lang-key="machine.add" onclick="Game.machineManagerUI.adjustMachine(\'' + machine.id + '\', 1)">' + Game.settings.getText('machine.add', 'Add') + '</button>',
                                '<button class="btn btn-default" data-lang-key="machine.remove" id="machineRemove_' + machine.id + '" onclick="Game.machineManagerUI.adjustMachine(\'' + machine.id + '\', -1)">' + Game.settings.getText('machine.remove', 'Remove') + '</button>',
                            '</div>',
                        '</div>'
                    );
                }
                parts.push('</div>');
            }
            document.getElementById(category.id + '_content').innerHTML = parts.join('');
        }
    };

    instance.setBatchAmount = function(amount) {
        this.batchAmount = amount;
        var selects = this.root.querySelectorAll('.machine-batch-select');
        for (var i = 0; i < selects.length; i++) {
            selects[i].value = String(amount);
        }
    };

    instance.getCategoryLangKey = function(title) {
        if (title === 'Energy') { return 'subtab.energy'; }
        if (title === 'Earth') { return 'subtab.earth'; }
        if (title === 'Inner Planets') { return 'subtab.innerPlanets'; }
        if (title === 'Outer Planets') { return 'subtab.outerPlanets'; }
        return '';
    };

    instance.getCategoryTitle = function(title) {
        var key = this.getCategoryLangKey(title);
        return key ? Game.settings.getText(key, title) : title;
    };

    instance.selectCategory = function(categoryId) {
        var panes = this.root.querySelectorAll('.machine-manager-pane');
        for (var i = 0; i < panes.length; i++) {
            panes[i].className = panes[i].id === categoryId ? 'machine-manager-pane active' : 'machine-manager-pane';
        }

        var navRows = this.root.querySelectorAll('.machine-manager-nav-row');
        for (var j = 0; j < navRows.length; j++) {
            navRows[j].className = navRows[j].getAttribute('data-machine-pane') === categoryId
                ? 'sideTab machine-manager-nav-row info'
                : 'sideTab machine-manager-nav-row';
        }
    };

    instance.adjustMachine = function(machineId, direction) {
        var machine = this.machineLookup[machineId];
        if (!machine) {
            return;
        }

        var action = window[machine.getter];
        if (direction > 0 && typeof action === 'function') {
            for (var i = 0; i < this.batchAmount; i++) {
                action();
            }
        } else if (direction < 0) {
            for (var j = 0; j < this.batchAmount; j++) {
                if ((window[machine.countVar] || 0) <= 0) {
                    break;
                }
                destroyMachine(machine.countVar);
            }
        }

        if (typeof refreshPerSec === 'function') {
            refreshPerSec(1);
        }
        if (typeof legacyRefreshUI === 'function') {
            legacyRefreshUI();
        }
        this.refresh();
    };

    instance.refresh = function() {
        if (!this.root || !Game.settings || typeof Game.settings.format !== 'function') {
            return;
        }

        for (var id in this.machineLookup) {
            var machine = this.machineLookup[id];
            var count = window[machine.countVar] || 0;
            var output = window[machine.outputVar] || 0;
            var production = count * output;

            var countEl = document.getElementById('machineCount_' + id);
            var prodEl = document.getElementById('machineProd_' + id);
            var removeEl = document.getElementById('machineRemove_' + id);

            if (countEl) {
                countEl.textContent = Game.settings.format(count);
            }
            if (prodEl) {
                prodEl.textContent = Game.settings.format(production, production < 1 && production > 0 ? 1 : 0) + '/sec';
            }
            if (removeEl) {
                removeEl.disabled = count <= 0;
            }
        }
    };

    Game.uiComponents.push(instance);

    return instance;

}());
