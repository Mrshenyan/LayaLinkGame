export default class CellScript extends Laya.Script {
    /** @prop {name:gemType,tips:"宝石的类型",type:Int,default:1} */
    gemType:number = 1;
    private gemS:Array<Laya.Image>;
    private chioced:Laya.Image;
    private GemParent:Laya.Node;
    constructor() { super(); }
    onAwake():void{
        this.GemParent = this.owner.getChildByName("Panel");
        for(let i=0;i<this.GemParent.numChildren;i++){
            this.gemS.push(<Laya.Image>this.GemParent.getChildAt(i));
        }
    }
    onEnable(): void {
    }

    onDisable(): void {
    }



    /**
     * 初始化游戏区域
     */
    public Init():Laya.Node{
        let self = this;
        this.GemParent = this.owner.getChildByName("Panel");
        this.gemS = new Array<Laya.Image>();
        for(let i=0;i<this.GemParent.numChildren;i++){
            this.gemS.push(<Laya.Image>this.GemParent.getChildAt(i));
        }
        this.gemType = Math.ceil(Math.random()*4);
        for(let i=0;i<this.gemS.length;i++){
            if((i+1)==this.gemType){
                this.gemS[i].visible = true;
            }
        }
        console.log("输出生成的宝石类型：",this.gemType);
        return this.owner;
    }
}