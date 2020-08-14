import MainScene from "./MainScene";

export default class ScanScript extends Laya.Script {

    MainFunc();

    
    MainFunc(){
        if(MainScene.LINECONTRL==1){
            postMessage(MainScene.LINECONTRL,"LINECONTRL");
        }
    }
}