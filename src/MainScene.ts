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

    /**获取游戏等级 */
    getGameLv(){
        return this.GameLV;
    }
    /**单元格width */
    configX = 100;
    /**单元格height */
    configY = 100;
    /**游戏区域生成函数 */
    cretatGem(){
        let cell:Laya.Image = null;
        this.GemContain
        let sn = 0;
        for(let i=0;i<(this.GameLV+1+2);i++){
            for(let j=0;j<this.GameLV+1+2;j++){
                cell = Laya.Pool.getItemByCreateFun("cellPrefab",this.cellPrefab.create,this.cellPrefab);
                cell.getComponent(CellScript).Init(sn,i,j);
                sn++;
                cell.x = this.configX * j;
                cell.y = this.configY * i;
                if(i==0||i==(this.GameLV+2)||j==0||j==(this.GameLV+2)){
                    cell.visible = false;
                    cell.getComponent(CellScript).setEliminateOrNot(true);
                }
                this.GemContain.addChild(cell);
            }
        }
    }
    /**消除函数 */
    static eliminate(sn1:number,sn2:number){
        let p1_Rootparent = MainScene.MS_self.gemS[sn1].parent.parent.parent
        let p2_Rootparent = MainScene.MS_self.gemS[sn2].parent.parent.parent
        let p1_chioced = <Laya.Image>p1_Rootparent.getChildAt(0);
        let p2_chioced = <Laya.Image>p2_Rootparent.getChildAt(0);
        if(p1_Rootparent.getComponent(CellScript).getEliminateOrNot()==false&&p2_Rootparent.getComponent(CellScript).getEliminateOrNot()==false){
            MainScene.MS_self.gemS[sn1].visible = false;
            MainScene.MS_self.gemS[sn2].visible = false;
            p1_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
            p2_Rootparent.getComponent(CellScript).setEliminateOrNot(true);
            MainScene.remainCount-=2;
            
        }
        p1_chioced.visible = false;
        p2_chioced.visible = false;
        CheckScript.reSet();
        for(let i=0;i<MainScene.MS_self.GemContain.numChildren-1;i++){
            for(let j=i+1;j<MainScene.MS_self.GemContain.numChildren;j++){
                let imgI = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(i);
                let imgJ = <Laya.Image>MainScene.MS_self.GemContain.getChildAt(j);
                let gemI = <Laya.Image>MainScene.MS_self.gemS[i];
                let gemJ = <Laya.Image>MainScene.MS_self.gemS[j];
                if(imgI.visible&&imgJ.visible&&gemI.visible&&gemJ.visible){
                    if(imgI.getComponent(CellScript).gemType==imgJ.getComponent(CellScript).gemType){
                        return true;
                    }
                }
            }
        }
        console.log("没有可以消除的");
        return false;
    }
    /**取消选中函数
     * @param sn1 选中的目标点1
     * @param sn2 选中的目标点2
     */
    static cancleChioced(sn1,sn2){
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