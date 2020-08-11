(function () {
    'use strict';

    class CheckScript extends Laya.Script {
        constructor() {
            super();
        }
        static Check(sn1, sn2, type1, type2) {
            if (type1 != type2)
                return 0;
            if (sn1 == -1 || sn2 == -1) {
                return -1;
            }
            return MainScene.eliminate(sn1, sn2);
        }
        static eliminate(type, sn) {
            let returnValue = -1;
            if (this.theOne == -1) {
                this.theOne = sn;
                this.type1 = type;
            }
            else {
                this.theTwo = sn;
                this.type2 = type;
            }
            returnValue = this.Check(this.theOne, this.theTwo, this.type1, this.type2);
            return returnValue;
        }
        static reSet() {
            this.theOne = -1;
            this.theTwo = -1;
            this.type1 = -1;
            this.type2 = -1;
        }
    }
    CheckScript.theOne = -1;
    CheckScript.theTwo = -1;
    CheckScript.type1 = -1;
    CheckScript.type2 = -1;

    class CellScript extends Laya.Script {
        constructor() {
            super();
            this.gemType = 1;
            this.gemSN = -1;
        }
        onAwake() {
            this.GemParent = this.owner.getChildByName("Panel");
            this.BtnClick = this.owner.getChildByName("btn_click");
            for (let i = 0; i < this.GemParent.numChildren; i++) {
                this.gemS.push(this.GemParent.getChildAt(i));
            }
        }
        onEnable() {
        }
        onDisable() {
        }
        Init(sn) {
            let self = this;
            CellScript.CS_self = this;
            this.GemParent = this.owner.getChildByName("Panel");
            this.gemS = new Array();
            this.chioced = this.owner.getChildByName("chioce");
            this.BtnClick = this.owner.getChildByName("btn_click");
            this.gemSN = sn;
            for (let i = 0; i < this.GemParent.numChildren; i++) {
                this.gemS.push(this.GemParent.getChildAt(i));
            }
            this.gemType = Math.ceil(Math.random() * 4);
            for (let i = 0; i < this.gemS.length; i++) {
                if ((i + 1) == this.gemType) {
                    this.gemS[i].visible = true;
                }
            }
            this.BtnClick.clickHandler = new Laya.Handler(this, this.btnCallBack, [this.gemType, this.gemSN]);
            console.log("输出生成的宝石类型：", this.gemType);
            return this.owner;
        }
        btnCallBack(gemType, gemSN) {
            let EliminateReturnValue = -1;
            this.chioced.visible = !this.chioced.visible;
            console.log("you clicked gem's clickData is : ", gemType, gemSN);
            if (!this.chioced.visible) {
                CheckScript.reSet();
                return;
            }
            EliminateReturnValue = CheckScript.eliminate(gemType, gemSN);
            console.log("EliminateReturnValue: ", EliminateReturnValue);
        }
    }
    CellScript.CS_self = null;

    class MainScene extends Laya.Script {
        constructor() {
            super();
            this.GameLV = 3;
            this.configX = 100;
            this.configY = 100;
        }
        onAwake() {
            this.GemContain = this.owner.getChildByName("GemContain");
            MainScene.MS_self = this;
            MainScene.MS_self.gemS = new Array();
            this.cretatGem();
        }
        onEnable() {
        }
        onDisable() {
        }
        cretatGem() {
            let cells = MainScene.remainCount = Math.pow((this.GameLV + 1), 2);
            let cell = null;
            this.GemContain;
            let indexX = 0;
            let indexY = 0;
            for (let i = 0; i < cells; i++) {
                cell = Laya.Pool.getItemByCreateFun("cellPrefab", this.cellPrefab.create, this.cellPrefab);
                cell.getComponent(CellScript).Init(i);
                cell.x = this.configX * indexX;
                cell.y = this.configY * indexY;
                cell.x = this.configX * indexX;
                cell.y = this.configY * indexY;
                indexX++;
                if (indexX > this.GameLV) {
                    indexX = 0;
                    indexY += 1;
                }
                console.log("cell's pos: s", cell.x, cell.y);
                MainScene.MS_self.gemS.push(cell);
                this.GemContain.addChild(cell);
            }
        }
        static eliminate(sn1, sn2) {
            MainScene.MS_self.gemS[sn1].destroy();
            MainScene.MS_self.gemS[sn2].destroy();
            MainScene.remainCount -= 2;
            CheckScript.reSet();
            for (let i = 0; i < MainScene.MS_self.GemContain.numChildren - 1; i++) {
                for (let j = i + 1; j < MainScene.MS_self.GemContain.numChildren; j++) {
                    if (MainScene.MS_self.GemContain.getChildAt(i).getComponent(CellScript).gemType == MainScene.MS_self.GemContain.getChildAt(j).getComponent(CellScript).gemType) {
                        return;
                    }
                }
            }
            console.log("没有可以消除的");
        }
    }
    MainScene.MS_self = null;
    MainScene.remainCount = 0;

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class MainSceneUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("MainScene");
            }
        }
        ui.MainSceneUI = MainSceneUI;
        REG("ui.MainSceneUI", MainSceneUI);
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 1000;
            this._time = 0;
            this._started = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
            let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
            flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._gameBox.addChild(flyer);
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            this._gameBox.removeChildren();
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            GameUI.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._control = this.getComponent(GameControl);
            this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
        }
        onTipClick(e) {
            this.tipLbll.visible = false;
            this._score = 0;
            this.scoreLbl.text = "";
            this._control.startGame();
        }
        addScore(value = 1) {
            this._score += value;
            this.scoreLbl.changeText("分数：" + this._score);
            if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = Math.round(Math.random() * 5) + 1;
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            if (other.label === "buttle") {
                if (this.level > 1) {
                    this.level--;
                    this._text.changeText(this.level + "");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
                else {
                    if (owner.parent) {
                        let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                        effect.pos(owner.x, owner.y);
                        owner.parent.addChild(effect);
                        effect.play(0, true);
                        owner.removeSelf();
                        Laya.SoundManager.playSound("sound/destroy.wav");
                    }
                }
                GameUI.instance.addScore(1);
            }
            else if (other.label === "ground") {
                owner.removeSelf();
                GameUI.instance.stopGame();
            }
        }
        createEffect() {
            let ani = new Laya.Animation();
            ani.loadAnimation("test/TestAni.ani");
            ani.on(Laya.Event.COMPLETE, null, recover);
            function recover() {
                ani.removeSelf();
                Laya.Pool.recover("effect", ani);
            }
            return ani;
        }
        onDisable() {
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("MainScene.ts", MainScene);
            reg("script/GameUI.ts", GameUI);
            reg("script/GameControl.ts", GameControl);
            reg("script/Bullet.ts", Bullet);
            reg("CellScript.ts", CellScript);
            reg("script/DropBox.ts", DropBox);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "MainScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = true;
    GameConfig.stat = true;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
