import CheckScript_1 from "./CheckScript_1";
import MainScene from "./MainScene";

export default class CellScript extends Laya.Script {
    /** @prop {name:gemType,tips:"宝石的类型",type:Int,default:1} */
    public gemType:number = 1;
    /** @prop {name:posx,tips:"宝石中心点x",type:Int,default:49.5} */
    public posx:number =49.5;
    /** @prop {name:posy,tips:"宝石中心点y",type:Int,default:49.5} */
    public posy:number =49.5;
    private gemS:Array<Laya.Image>;
    private chioced:Laya.Image;
    private GemParent:Laya.Node;
    private BtnClick:Laya.Button;
    private gemSN:number = -1;
    constructor() { super(); }
    public static CS_self:CellScript = null;
    private CellPos:Laya.Vector2 = new Laya.Vector2(-1,-1);
    setCellPos(x:number,y:number){
        this.CellPos.x = x;
        this.CellPos.y = y;
        // console.log("cellpos: ",this.CellPos.x,this.CellPos.y);
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
    public Init(sn:number,indexX,indexY,width):Laya.Node{
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
        this.setCellPos(indexX,indexY);
        this.BtnClick.clickHandler = new Laya.Handler(this,this.btnCallBack,[this.gemType,this.gemSN])
        // console.log("输出生成的宝石类型：",this.gemType);
        // console.log("cellpos: ",this.CellPos.x,this.CellPos.y);
        
        return this.owner;
    }

    setWH(width){
        let node =<Laya.Sprite>this.owner;
        node.width = width;
        for(let i=0;i<node.numChildren;i++){
            if(node.getComponent[i].numChildren>0){
                
            }
        }
    }
    btnCallBack(gemType,gemSN){
        if(this.getEliminateOrNot()){
            return;
        }
        let EliminateReturnValue = -1;
        this.chioced.visible=!this.chioced.visible;
        // console.log("cellpos           : ",this.getCellPos(),gemSN);
        if(!this.chioced.visible){
            CheckScript_1.reSet();
            return;
        }
        EliminateReturnValue = CheckScript_1.eliminate(gemType,gemSN,this.CellPos);
        // console.log("EliminateReturnValue: ",EliminateReturnValue);
    }


}