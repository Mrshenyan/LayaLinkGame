import CheckScript from "./CheckScript";
import MainScene from "./MainScene";

export default class CellScript extends Laya.Script {
    /** @prop {name:gemType,tips:"宝石的类型",type:Int,default:1} */
    public gemType:number = 1;
    private gemS:Array<Laya.Image>;
    private chioced:Laya.Image;
    private GemParent:Laya.Node;
    private BtnClick:Laya.Button;
    private gemSN:number = -1;
    constructor() { super(); }
    public static CS_self:CellScript = null;
    private CellPos:Laya.Vector2 = new Laya.Vector2(-1,-1);
    setCellPos(x:number,y:number){
        this.CellPos.y = x;
        this.CellPos.x = y;
        console.log(this.CellPos);
    }
    getCellPos():Laya.Vector2{
        return this.CellPos;
    }
    getGemSn(){
        return this.gemSN;
    }
    private EliminateOrNot:boolean = false;
    public getEliminateOrNot(){
        return this.EliminateOrNot;
    }
    public setEliminateOrNot(v:boolean){
        this.EliminateOrNot = v;
    }
    onAwake():void{
        this.GemParent = this.owner.getChildByName("Panel");
        this.BtnClick = <Laya.Button>this.owner.getChildByName("btn_click");
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
     * @param sn the gem's sn
     */
    public Init(sn:number):Laya.Node{
        let self = this;
        CellScript.CS_self = this;
        this.GemParent = this.owner.getChildByName("Panel");
        this.gemS = new Array<Laya.Image>();
        this.chioced = <Laya.Image>this.owner.getChildByName("chioce");
        this.BtnClick = <Laya.Button>this.owner.getChildByName("btn_click");
        this.gemSN = sn;
        for(let i=0;i<this.GemParent.numChildren;i++){
            this.gemS.push(<Laya.Image>this.GemParent.getChildAt(i));
        }
        this.gemType = Math.ceil(Math.random()*4);
        for(let i=0;i<this.gemS.length;i++){
            if((i+1)==this.gemType){
                this.gemS[i].visible = true;
                MainScene.MS_self.gemS.push(this.gemS[i]);
            }
        }
        this.BtnClick.clickHandler = new Laya.Handler(this,this.btnCallBack,[this.gemType,this.gemSN])
        console.log("输出生成的宝石类型：",this.gemType);
        
        return this.owner;
    }

    btnCallBack(gemType,gemSN){
        let EliminateReturnValue = -1;
        this.chioced.visible=!this.chioced.visible;
        console.log("you clicked gem's clickData is : ",gemType,gemSN,this.CellPos);
        if(!this.chioced.visible){
            CheckScript.reSet();
            return;
        }
        EliminateReturnValue = CheckScript.eliminate(gemType,gemSN,this.CellPos);
        console.log("EliminateReturnValue: ",EliminateReturnValue);
    }


}