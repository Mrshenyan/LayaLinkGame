import CellScript from "./CellScript";

export default class MainScene extends Laya.Script {
    GemContain:Laya.Panel;
    /** @prop {name:cellPrefab,tips:"宝石预制体对象",type:Prefab} */
    cellPrefab :Laya.Prefab;
    private GameLV:number = 2;
    constructor() { super(); }
    
    onAwake():void{
        this.GemContain = <Laya.Panel>this.owner.getChildByName("GemContain");
        this.cretatGem();
    }

    onEnable(): void {

    }

    onDisable(): void {
    }

    configX = 100;
    configY = 100;
    cretatGem(){
        let cells:number = Math.pow((this.GameLV+1),2);
        let cell:Laya.Sprite = null;
        this.GemContain
        for(let i=0;i<cells;i++){
            cell = Laya.Pool.getItemByCreateFun("cellPrefab",this.cellPrefab.create,this.cellPrefab);
            cell.getComponent(CellScript).Init();
            cell.x = this.configX*i;
            cell.y = this.configY*i;
            this.GemContain.addChild(cell);
        }
    }
}