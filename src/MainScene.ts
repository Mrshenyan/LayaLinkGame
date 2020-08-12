import CellScript from "./CellScript";
import CheckScript from "./CheckScript";
import { time } from "console";

export default class MainScene extends Laya.Script {
    GemContain:Laya.Panel;
    /** @prop {name:cellPrefab,tips:"宝石预制体对象",type:Prefab} */
    cellPrefab :Laya.Prefab;
    private GameLV:number =3;
    constructor() { super(); }
    static MS_self:MainScene = null;
    public gemS:Array<Laya.Image>;
    private static remainCount = 0;
    onAwake():void{
        this.GemContain = <Laya.Panel>this.owner.getChildByName("GemContain");
        MainScene.MS_self = this;
        MainScene.MS_self.gemS = new Array<Laya.Image>();
        this.cretatGem();
    }

    onEnable(): void {

    }

    onDisable(): void {
    }

    getGameLv(){
        return this.GameLV;
    }

    configX = 100;
    configY = 100;
    cretatGem(){
        let cells:number = MainScene.remainCount = Math.pow((this.GameLV+1+2),2);
        let cell:Laya.Image = null;
        this.GemContain
        let indexX = 0;
        let indexY = 0;
        for(let i=0;i<cells;i++){
            cell = Laya.Pool.getItemByCreateFun("cellPrefab",this.cellPrefab.create,this.cellPrefab);
            cell.getComponent(CellScript).Init(i);
            cell.x = this.configX * indexX;
            cell.y = this.configY * indexY;
            cell.getComponent(CellScript).setCellPos(indexX,indexY);
            if(indexX==0||indexX==this.GameLV+2||indexY==0||indexY==this.GameLV+2){
                // cell.visible = false;
            }
            indexY++;
            if(indexY>this.GameLV+2){
                indexY=0;
                indexX+=1;
            }
            console.log("cell's pos: s",cell.x,cell.y);
            // MainScene.MS_self.gemS.push(cell);
            this.GemContain.addChild(cell);
        }
    }
    
    static eliminate(sn1:number,sn2:number){
        MainScene.MS_self.gemS[sn1].visible = false;
        MainScene.MS_self.gemS[sn2].visible = false;
        let p1_Rootpraent = MainScene.MS_self.gemS[sn1].parent.parent.parent
        let p2_Rootpraent = MainScene.MS_self.gemS[sn2].parent.parent.parent
        let p1_chioced = <Laya.Image>p1_Rootpraent.getChildAt(0);
        let p2_chioced = <Laya.Image>p2_Rootpraent.getChildAt(0);
        p1_Rootpraent.getComponent(CellScript).setEliminateOrNot(true);
        p2_Rootpraent.getComponent(CellScript).setEliminateOrNot(true);
        p1_chioced.visible = false;
        p2_chioced.visible = false;
        MainScene.remainCount-=2;
        CheckScript.reSet();
        for(let i=0;i<MainScene.MS_self.GemContain.numChildren-1;i++){
            for(let j=i+1;j<MainScene.MS_self.GemContain.numChildren;j++){
                let imgI = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(i);
                let imgJ = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(j);
                let gemI = <Laya.Image>MainScene.MS_self.gemS[i];
                let gemJ = <Laya.Image>MainScene.MS_self.gemS[j];
                if(imgI.visible&&imgJ.visible&&gemI.visible&&gemJ.visible){
                    if(imgI.getComponent(CellScript).gemType==imgJ.getComponent(CellScript).gemType){
                        return
                    }
                }
            }
        }
        console.log("没有可以消除的");
    }

    cancleChioced(sn1,sn2){
        console.log("can not eliminate");
        let timer = new Laya.Timer();
        timer.once(500,this,()=>{
            let target1_img = <Laya.Image>MainScene.MS_self.gemS[sn1].parent.parent.parent.getChildAt(0)//.destroy();
            target1_img.visible = false;
            let target2_img = <Laya.Image>MainScene.MS_self.gemS[sn2].parent.parent.parent.getChildAt(0)//.destroy();
            target2_img.visible = false;
            timer.clear(this,()=>{
                console.log("清除计时器");
            });
        })
        CheckScript.reSet();
    }
}