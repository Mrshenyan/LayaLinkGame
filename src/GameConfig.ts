/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import MainScene from "./MainScene"
import GameUI from "./script/GameUI"
import GameControl from "./script/GameControl"
import Bullet from "./script/Bullet"
import CellScript from "./CellScript"
import DropBox from "./script/DropBox"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=640;
    static height:number=1136;
    static scaleMode:string="fixedwidth";
    static screenMode:string="none";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="MainScene.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=true;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("MainScene.ts",MainScene);
        reg("script/GameUI.ts",GameUI);
        reg("script/GameControl.ts",GameControl);
        reg("script/Bullet.ts",Bullet);
        reg("CellScript.ts",CellScript);
        reg("script/DropBox.ts",DropBox);
    }
}
GameConfig.init();