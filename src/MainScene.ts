import CellScript from "./CellScript";
import CheckScript from "./CheckScript";

export default class MainScene extends Laya.Script {
    GemContain:Laya.Panel;
    /** @prop {name:cellPrefab,tips:"宝石预制体对象",type:Prefab} */
    cellPrefab :Laya.Prefab;
    private GameLV:number =3;
    constructor() { super(); }
    static MS_self:MainScene = null;
    private gemS:Array<Laya.Image>;
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

    configX = 100;
    configY = 100;
    cretatGem(){
        let cells:number = MainScene.remainCount = Math.pow((this.GameLV+1),2);
        let cell:Laya.Image = null;
        this.GemContain
        let indexX = 0;
        let indexY = 0;
        for(let i=0;i<cells;i++){
            cell = Laya.Pool.getItemByCreateFun("cellPrefab",this.cellPrefab.create,this.cellPrefab);
            
            cell.getComponent(CellScript).Init(i);
            cell.x = this.configX * indexX;
            cell.y = this.configY * indexY;
            cell.x = this.configX*indexX;
            cell.y = this.configY*indexY;
            indexX++
            if(indexX>this.GameLV){
                indexX=0;
                indexY+=1;
            }
            console.log("cell's pos: s",cell.x,cell.y);
            MainScene.MS_self.gemS.push(cell);
            this.GemContain.addChild(cell);
        }
    }
    
    static eliminate(sn1:number,sn2:number){
        // MainScene.MS_self.gemS[sn1].visible = false;
        // MainScene.MS_self.gemS[sn2].visible = false;
        MainScene.MS_self.gemS[sn1].destroy();
        MainScene.MS_self.gemS[sn2].destroy();
        MainScene.remainCount-=2;
        CheckScript.reSet();
        for(let i=0;i<MainScene.MS_self.GemContain.numChildren-1;i++){
            for(let j=i+1;j<MainScene.MS_self.GemContain.numChildren;j++){
                if(MainScene.MS_self.GemContain.getChildAt(i).getComponent(CellScript).gemType==MainScene.MS_self.GemContain.getChildAt(j).getComponent(CellScript).gemType){
                    return
                }
            }
        }
        console.log("没有可以消除的");
    }
}