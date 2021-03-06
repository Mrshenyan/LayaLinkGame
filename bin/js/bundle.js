(function () {
   'use strict';

   class CheckScript extends Laya.Script {
       constructor() {
           super();
       }
       onAwake() {
           if (!CheckScript.Instance)
               CheckScript.Instance = new CheckScript();
           CheckScript.CS_self = CheckScript.Instance;
       }
       static Check(sn1, sn2, type1, type2, pos1, pos2) {
           let target1 = MainScene.MS_self.GemContain.getChildAt(sn1);
           let goCheck = false;
           let target2 = MainScene.MS_self.GemContain.getChildAt(sn2);
           let t1Nodes_H = new Laya.Node();
           let t2Nodes_H = new Laya.Node();
           let dx = 1;
           let dy = 6;
           let blockCount = 0;
           let zhedian2 = new Laya.Vector2(-1, -1);
           if (type1 != type2 && (type1 != -1 && type2 != -1)) {
               goCheck = false;
               return MainScene.cancleChioced(sn1, sn2);
           }
           if (sn1 == -1 || sn2 == -1) {
               return -1;
           }
           if (pos2.x == pos1.x) {
               Horizon(target1, target2, pos1, pos2, true, true);
           }
           if (pos2.y == pos1.y) {
               Horizon(target1, target2, pos1, pos2, true, false);
           }
           if (!goCheck) {
               turn_once(target1, target2, pos1, pos2, true);
           }
           if (!goCheck) {
               turn_twice(target1, target2, pos1, pos2);
           }
           function Horizon(target1, target2, pos1, pos2, eli, hv) {
               blockCount = 0;
               let node;
               let sn = Math.min(target1.getComponent(CellScript).getGemSn(), target2.getComponent(CellScript).getGemSn());
               let nodesn = sn;
               let delat = hv ? Math.abs(pos1.y - pos2.y) : Math.abs(pos1.x - pos2.x);
               for (let i = 1; i < delat; i++) {
                   nodesn = sn;
                   if (hv) {
                       nodesn += (i * dx);
                   }
                   else {
                       nodesn += (i * dy);
                   }
                   node = MainScene.MS_self.GemContain.getChildAt(nodesn);
                   if (node.getComponent(CellScript).getEliminateOrNot()) {
                       if (i == (delat - 1)) {
                           if (eli && blockCount == 0) {
                               goCheck = true;
                               MainScene.eliminate(sn1, sn2);
                               MainScene.MS_self.DrawLine(sn1, sn2);
                               return true;
                           }
                           if (!eli && blockCount == 0)
                               return true;
                       }
                   }
                   else {
                       blockCount++;
                   }
               }
               if (delat == 1) {
                   if (eli) {
                       goCheck = true;
                       MainScene.MS_self.DrawLine(sn1, sn2);
                       MainScene.eliminate(sn1, sn2);
                       return true;
                   }
                   else {
                       return true;
                   }
               }
           }
           function turn_once(target1, target2, pos1, pos2, eli) {
               console.log("进入有1个拐点的情况");
               let pos3 = new Laya.Vector2(pos1.x, pos2.y);
               let pos4 = new Laya.Vector2(pos2.x, pos1.y);
               let sn3 = pos3.x * (CheckScript.GameLv) + pos3.y;
               let sn4 = pos4.x * (CheckScript.GameLv) + pos4.y;
               let target3 = MainScene.MS_self.GemContain.getChildAt(sn3);
               let target4 = MainScene.MS_self.GemContain.getChildAt(sn4);
               if (target3.getComponent(CellScript).getEliminateOrNot()) {
                   let arg1 = Horizon(target3, target1, pos3, pos1, false, true);
                   let arg2 = Horizon(target3, target2, pos3, pos2, false, false);
                   if (arg1 && arg2) {
                       if (eli) {
                           goCheck = true;
                           zhedian2 = target3.getComponent(CellScript).getGemSn();
                           MainScene.MS_self.DrawLine(sn1, sn2, sn3);
                           MainScene.eliminate(sn1, sn2);
                           return true;
                       }
                       else {
                           zhedian2 = target3.getComponent(CellScript).getGemSn();
                           return true;
                       }
                   }
               }
               if (target4.getComponent(CellScript).getEliminateOrNot()) {
                   let arg1 = Horizon(target4, target2, pos4, pos2, false, true);
                   let arg2 = Horizon(target4, target1, pos4, pos1, false, false);
                   if (arg1 && arg2) {
                       if (eli) {
                           goCheck = true;
                           zhedian2 = target4.getComponent(CellScript).getGemSn();
                           MainScene.MS_self.DrawLine(sn1, sn2, sn4);
                           MainScene.eliminate(sn1, sn2);
                           return true;
                       }
                       else {
                           zhedian2 = target4.getComponent(CellScript).getGemSn();
                           return true;
                       }
                   }
               }
               return false;
           }
           function turn_twice(target1, target2, pos1, pos2) {
               console.log("进入有2个拐点的情况", pos1, pos2);
               if (!turn_twice_HScan(target1, target2, t1Nodes_H, pos1, pos2)) {
                   turn_twice_VScan(target1, target2, t2Nodes_H, pos1, pos2);
               }
               return false;
           }
           function turn_twice_HScan(target1, target2, HScanNode, pos1, pos2) {
               let H_flag_r;
               let H_flag_L;
               let V_flag_r;
               MainScene.LINECONTRL = 0;
               for (let i = pos1.y - 1; (i < pos1.y && i >= 0); i--) {
                   if (MainScene.LINECONTRL == 0) {
                       if (i < 0 || i > CheckScript.GameLv) {
                           return false;
                       }
                       t1_Hfunc(i);
                       t2_Hfunc(i);
                   }
               }
               for (let i = pos1.y + 1; (i > pos1.y && i < CheckScript.GameLv); i++) {
                   if (MainScene.LINECONTRL == 0) {
                       if (i < 0 || i > CheckScript.GameLv) {
                           return false;
                       }
                       t1_Hfunc(i);
                       t2_Hfunc(i);
                   }
               }
               return false;
               function t1_Hfunc(i) {
                   let HScanPos = new Laya.Vector2();
                   let HSSN = pos1.x * (CheckScript.GameLv) + i;
                   HScanNode = MainScene.MS_self.GemContain.getChildAt(HSSN);
                   HScanPos = HScanNode.getComponent(CellScript).getCellPos();
                   HSSN = HScanNode.getComponent(CellScript).getGemSn();
                   if (HScanNode.getComponent(CellScript).getEliminateOrNot()) {
                       H_flag_r = Horizon(HScanNode, target1, HScanPos, pos1, false, true);
                       H_flag_L = Horizon(HScanNode, target1, HScanPos, pos1, false, false);
                       V_flag_r = turn_once(HScanNode, target2, HScanPos, pos2, false);
                       if ((H_flag_r && V_flag_r) || (H_flag_L && V_flag_r)) {
                           console.log("存在与target1同行与target2单拐点的点", HScanNode);
                           MainScene.MS_self.DrawLine(sn1, sn2, HSSN, zhedian2);
                           goCheck = true;
                           MainScene.eliminate(sn1, sn2);
                           console.log(HScanPos, H_flag_r, H_flag_L, V_flag_r, "H_1");
                           return true;
                       }
                   }
                   console.log(HScanPos, H_flag_r, H_flag_L, V_flag_r, "H_1");
                   return false;
               }
               function t2_Hfunc(i) {
                   let HScanPos = new Laya.Vector2();
                   let HSSN = pos1.x * (CheckScript.GameLv) + i;
                   HScanNode = MainScene.MS_self.GemContain.getChildAt(HSSN);
                   HScanPos = HScanNode.getComponent(CellScript).getCellPos();
                   HSSN = HScanNode.getComponent(CellScript).getGemSn();
                   if (HScanNode.getComponent(CellScript).getEliminateOrNot()) {
                       H_flag_r = Horizon(HScanNode, target2, HScanPos, pos2, false, true);
                       H_flag_L = Horizon(HScanNode, target2, HScanPos, pos2, false, false);
                       V_flag_r = turn_once(HScanNode, target1, HScanPos, pos1, false);
                       if ((H_flag_r && V_flag_r) || (H_flag_L && V_flag_r)) {
                           console.log("存在与target1同行与target2单拐点的点", HScanNode);
                           MainScene.MS_self.DrawLine(sn1, sn2, HSSN, zhedian2);
                           goCheck = true;
                           MainScene.eliminate(sn1, sn2);
                           console.log(HScanPos, H_flag_r, H_flag_L, V_flag_r, "H_2");
                           return true;
                       }
                   }
                   console.log(HScanPos, H_flag_r, H_flag_L, V_flag_r, "H_2");
                   return false;
               }
           }
           function turn_twice_VScan(target1, target2, VScanNode, pos1, pos2) {
               let H_flag_r;
               let H_flag_L;
               let V_flag_r;
               MainScene.LINECONTRL = 0;
               for (let i = pos1.x - 1; (i < pos1.x && i >= 0); i--) {
                   if (MainScene.LINECONTRL == 0) {
                       if (i < 0 || i > CheckScript.GameLv) {
                           return false;
                       }
                       t1_Vfunc(i);
                       t2_Vfunc(i);
                   }
               }
               for (let i = pos1.x + 1; (i > pos1.x && i < CheckScript.GameLv); i++) {
                   if (MainScene.LINECONTRL == 0) {
                       if (i < 0 || i > CheckScript.GameLv) {
                           return false;
                       }
                       t1_Vfunc(i);
                       t2_Vfunc(i);
                   }
               }
               return false;
               function t1_Vfunc(i) {
                   let VScanPos = new Laya.Vector2();
                   let VSSN = pos1.y + i * CheckScript.GameLv;
                   VScanNode = MainScene.MS_self.GemContain.getChildAt(VSSN);
                   VScanPos = VScanNode.getComponent(CellScript).getCellPos();
                   VSSN = VScanNode.getComponent(CellScript).getGemSn();
                   if (VScanNode.getComponent(CellScript).getEliminateOrNot()) {
                       H_flag_r = Horizon(VScanNode, target1, VScanPos, pos1, false, true);
                       H_flag_L = Horizon(VScanNode, target1, VScanPos, pos1, false, false);
                       V_flag_r = turn_once(VScanNode, target2, VScanPos, pos2, false);
                       if ((H_flag_r && V_flag_r) || (H_flag_L && V_flag_r)) {
                           console.log("存在与target1同行与target2单拐点的点", VScanNode);
                           MainScene.MS_self.DrawLine(sn1, sn2, VSSN, zhedian2);
                           goCheck = true;
                           MainScene.eliminate(sn1, sn2);
                           console.log(VScanPos, H_flag_r, H_flag_L, V_flag_r, "V_1");
                           return true;
                       }
                   }
                   console.log(VScanPos, H_flag_r, H_flag_L, V_flag_r, "V_1");
                   return false;
               }
               function t2_Vfunc(i) {
                   let VScanPos = new Laya.Vector2();
                   let VSSN = pos1.y + i * CheckScript.GameLv;
                   VScanNode = MainScene.MS_self.GemContain.getChildAt(VSSN);
                   VScanPos = VScanNode.getComponent(CellScript).getCellPos();
                   VSSN = VScanNode.getComponent(CellScript).getGemSn();
                   if (VScanNode.getComponent(CellScript).getEliminateOrNot()) {
                       H_flag_r = Horizon(VScanNode, target2, VScanPos, pos2, false, true);
                       H_flag_L = Horizon(VScanNode, target2, VScanPos, pos2, false, false);
                       V_flag_r = turn_once(VScanNode, target1, VScanPos, pos1, false);
                       if ((H_flag_r && V_flag_r) || (H_flag_L && V_flag_r)) {
                           console.log("存在与target1同行与target2单拐点的点", VScanNode);
                           MainScene.MS_self.DrawLine(sn1, sn2, VSSN, zhedian2);
                           goCheck = true;
                           MainScene.eliminate(sn1, sn2);
                           console.log(VScanPos, H_flag_r, H_flag_L, V_flag_r, "V_2");
                           return true;
                       }
                   }
                   console.log(VScanPos, H_flag_r, H_flag_L, V_flag_r, "V_2");
                   return false;
               }
           }
       }
       static eliminate(type, sn, pos) {
           if (!CheckScript.Instance) {
               CheckScript.Instance = new CheckScript();
               CheckScript.CS_self = CheckScript.Instance;
           }
           CheckScript.GameLv = MainScene.MS_self.getGameLv();
           let returnValue = -1;
           if (this.theOne == -1) {
               this.theOne = sn;
               this.type1 = type;
               this.pos1 = pos;
           }
           else {
               this.theTwo = sn;
               this.type2 = type;
               this.pos2 = pos;
           }
           returnValue = this.Check(this.theOne, this.theTwo, this.type1, this.type2, this.pos1, this.pos2);
           return returnValue;
       }
       static reSet() {
           console.log("重置");
           this.theOne = this.theTwo = this.type1 = this.type2 = -1;
           this.pos1 = this.pos2 = new Laya.Vector2(-1, -1);
       }
   }
   CheckScript.theOne = -1;
   CheckScript.theTwo = -1;
   CheckScript.type1 = -1;
   CheckScript.type2 = -1;
   CheckScript.pos1 = new Laya.Vector2(-1, -1);
   CheckScript.pos2 = new Laya.Vector2(-1, -1);
   CheckScript.Instance = null;
   CheckScript.CS_self = null;
   CheckScript.GameLv = 0;

   class CellScript extends Laya.Script {
       constructor() {
           super();
           this.gemType = 1;
           this.posx = 49.5;
           this.posy = 49.5;
           this.gemSN = -1;
           this.CellPos = new Laya.Vector2(-1, -1);
           this.EliminateOrNot = false;
       }
       setCellPos(x, y) {
           this.CellPos.x = x;
           this.CellPos.y = y;
       }
       getCellPos() {
           return this.CellPos;
       }
       getGemSn() {
           return this.gemSN;
       }
       getEliminateOrNot() {
           return this.EliminateOrNot;
       }
       setEliminateOrNot(v) {
           this.EliminateOrNot = v;
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
       Init(sn, indexX, indexY, width) {
           let node = this.owner;
           CellScript.CS_self = this;
           this.GemParent = this.owner.getChildByName("Panel");
           this.gemS = new Array();
           this.chioced = this.owner.getChildByName("chioce");
           this.BtnClick = this.owner.getChildByName("btn_click");
           node.set_scaleX(width / 160);
           node.set_scaleY(width / 160);
           this.gemSN = sn;
           for (let i = 0; i < this.GemParent.numChildren; i++) {
               this.gemS.push(this.GemParent.getChildAt(i));
           }
           this.gemType = Math.ceil(Math.random() * 4);
           for (let i = 0; i < this.gemS.length; i++) {
               if ((i + 1) == this.gemType) {
                   this.gemS[i].visible = true;
                   MainScene.MS_self.gemS.push(this.gemS[i]);
               }
           }
           this.setCellPos(indexX, indexY);
           this.BtnClick.clickHandler = new Laya.Handler(this, this.btnCallBack, [this.gemType, this.gemSN]);
           return this.owner;
       }
       btnCallBack(gemType, gemSN) {
           if (this.getEliminateOrNot()) {
               return;
           }
           let EliminateReturnValue = -1;
           this.chioced.visible = !this.chioced.visible;
           if (!this.chioced.visible) {
               CheckScript.reSet();
               return;
           }
           EliminateReturnValue = CheckScript.eliminate(gemType, gemSN, this.CellPos);
       }
   }
   CellScript.CS_self = null;

   class MainScene extends Laya.Script {
       constructor() {
           super();
           this.GameLV = 6;
           this.LineNode = null;
           this.CellType = [0, 0, 0, 0];
           this.LineDetalPos = 80;
           this.configX = 640 / this.GameLV;
           this.configY = 640 / this.GameLV;
       }
       onAwake() {
           this.GemContain = this.owner.getChildByName("GemContain");
           this.GemContain.width = 640;
           this.GemContain.height = 640;
           MainScene.MS_self = this;
           MainScene.MS_self.gemS = new Array();
           this.LineNode = new Laya.Sprite();
           this.LineNode.x = 0;
           this.LineNode.y = 160;
           this.LineNode.width = 640;
           this.LineNode.height = 640;
           this.CellType = new Array(this.getGameLv() + 1);
           this.owner.addChild(this.LineNode);
           this.cretatGem();
           let exit = true;
           let exitCount;
           this.cretatGem();
       }
       getGameLv() {
           return this.GameLV;
       }
       cretatGem() {
           this.GemContain.removeChildren();
           this.gemS = new Array();
           for (let i = 0; i < this.CellType.length; i++) {
               this.CellType[i] = 0;
           }
           if (this.GameLV < 3)
               this.GameLV = 3;
           if (this.GameLV % 2 != 0)
               this.GameLV += 1;
           let cell = null;
           let sn = 0;
           this.LineDetalPos *= this.configX / 160;
           for (let i = 0; i < (this.GameLV + 2); i++) {
               for (let j = 0; j < (this.GameLV + 2); j++) {
                   cell = Laya.Pool.getItemByCreateFun("cellPrefab", this.cellPrefab.create, this.cellPrefab);
                   cell.getComponent(CellScript).Init(sn, i, j, this.configY);
                   sn++;
                   cell.x = this.configX * j;
                   cell.y = this.configY * i;
                   if (i == 0 || i == this.GameLV || j == 0 || j == this.GameLV) {
                   }
                   if (cell.visible) {
                       this.setCellType(cell.getComponent(CellScript).gemType);
                   }
                   this.GemContain.addChild(cell);
               }
           }
       }
       static eliminate(sn1, sn2) {
           let p1_Rootparent = MainScene.MS_self.gemS[sn1].parent.parent.parent;
           let p2_Rootparent = MainScene.MS_self.gemS[sn2].parent.parent.parent;
           let p1_chioced = p1_Rootparent.getChildAt(0);
           let p2_chioced = p2_Rootparent.getChildAt(0);
           if (p1_Rootparent.getComponent(CellScript).getEliminateOrNot() == false && p2_Rootparent.getComponent(CellScript).getEliminateOrNot() == false) {
               MainScene.MS_self.gemS[sn1].visible = false;
               MainScene.MS_self.gemS[sn2].visible = false;
               p1_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
               p2_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
               MainScene.remainCount -= 2;
               MainScene.LINECONTRL = 1;
           }
           p1_chioced.visible = false;
           p2_chioced.visible = false;
           CheckScript.reSet();
           for (let i = 0; i < MainScene.MS_self.GemContain.numChildren - 1; i++) {
               for (let j = i + 1; j < MainScene.MS_self.GemContain.numChildren; j++) {
                   let imgI = MainScene.MS_self.GemContain.getChildAt(i);
                   let imgJ = MainScene.MS_self.GemContain.getChildAt(j);
                   let gemI = MainScene.MS_self.gemS[i];
                   let gemJ = MainScene.MS_self.gemS[j];
                   if (imgI.visible && imgJ.visible && gemI.visible && gemJ.visible) {
                       if (imgI.getComponent(CellScript).gemType == imgJ.getComponent(CellScript).gemType) {
                           return true;
                       }
                   }
               }
           }
           console.log("没有可以消除的");
           return false;
       }
       static cancleChioced(sn1, sn2) {
           console.log("can not eliminate");
           let timer = new Laya.Timer();
           timer.once(500, this, () => {
               let target1_img = MainScene.MS_self.gemS[sn1].parent.parent.parent.getChildAt(0);
               target1_img.visible = false;
               let target2_img = MainScene.MS_self.gemS[sn2].parent.parent.parent.getChildAt(0);
               target2_img.visible = false;
               timer.clear(this, () => {
                   console.log("清除计时器");
               });
           });
           CheckScript.reSet();
       }
       DrawLine(start, end, arg1, arg2) {
           let startSp = this.GemContain.getChildAt(start);
           let startPos = new Laya.Point(startSp.x + this.LineDetalPos, startSp.y + this.LineDetalPos);
           let endSp = this.GemContain.getChildAt(end);
           let endPos;
           if (arg1 && arg2) {
               let arg1Sp = this.GemContain.getChildAt(arg1);
               let arg1Pos = new Laya.Point(arg1Sp.x + this.LineDetalPos, arg1Sp.y + this.LineDetalPos);
               let arg2Sp = this.GemContain.getChildAt(arg2);
               let arg2Pos = new Laya.Point(arg2Sp.x + this.LineDetalPos, arg2Sp.y + this.LineDetalPos);
               console.log(arg1Pos);
               console.log(arg2Pos);
               endPos = new Laya.Point(endSp.x + this.LineDetalPos, endSp.y + this.LineDetalPos);
               this.LineNode.graphics.drawLine(startPos.x, startPos.y, arg1Pos.x, arg1Pos.y, "ff0000", 2);
               this.LineNode.graphics.drawLine(arg1Pos.x, arg1Pos.y, arg2Pos.x, arg2Pos.y, "ff0000", 2);
               this.LineNode.graphics.drawLine(arg2Pos.x, arg2Pos.y, endPos.x, endPos.y, "ff0000", 2);
           }
           else if (arg1 && !arg2) {
               let arg1Sp = this.GemContain.getChildAt(arg1);
               let arg1Pos = new Laya.Point(arg1Sp.x + this.LineDetalPos, arg1Sp.y + this.LineDetalPos);
               console.log(arg1Pos);
               endPos = new Laya.Point(endSp.x + this.LineDetalPos, endSp.y + this.LineDetalPos);
               this.LineNode.graphics.drawLine(startPos.x, startPos.y, arg1Pos.x, arg1Pos.y, "ff0000", 2);
               this.LineNode.graphics.drawLine(arg1Pos.x, arg1Pos.y, endPos.x, endPos.y, "ff0000", 2);
           }
           else {
               endPos = new Laya.Point(endSp.x + this.LineDetalPos, endSp.y + this.LineDetalPos);
               this.LineNode.graphics.drawLine(startPos.x, startPos.y, endPos.x, endPos.y, "ff0000", 2);
           }
           console.log(startPos);
           console.log(endPos);
           let timer = new Laya.Timer();
           timer.once(500, this, () => {
               MainScene.MS_self.LineNode.graphics.clear();
               timer.clear(this, () => {
                   console.log("清除计时器");
               });
           });
       }
       setCellType(type) {
           this.CellType[type - 1]++;
       }
   }
   MainScene.MS_self = null;
   MainScene.remainCount = 0;
   MainScene.LINECONTRL = 0;

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
   GameConfig.debug = false;
   GameConfig.stat = false;
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
