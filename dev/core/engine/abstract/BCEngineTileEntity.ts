/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />

// test
IDRegistry.genBlockID("WIRE");
Block.createBlock("WIRE",
    [{name: "WIRE", texture: [["stone", 0]], inCreative: true}]);
RF.registerWire(BlockID["WIRE"]);
class BCEngineTileEntity {
    constructor(public readonly maxHeat: number, protected texture: EngineTexture){}
    protected data = {// it will be rewriten during runtime
        meta: null,
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }
    protected defaultValues = {
        meta: null,
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }
    x: number; y: number; z: number;

    engineAnimation = null;
    get meta(){
        if(!this.data.meta){
            this.data.meta = this.getConnectionSide();
        }
        return this.data.meta;
    }

    set meta(value){
        this.data.meta = value;
        this.engineAnimation.connectionSide = value;
    }

    protected init(){
        this.meta = this.getConnectionSide();
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.data.heatStage, this.texture);
        this.engineAnimation.connectionSide = this.meta;
    }

    protected tick(){
        this.engineAnimation.update(this.data.power, this.data.heatStage);
        this.updatePower();

        this.data.heatStage = HeatOrder[Math.min(3, Math.max(0, this.getHeatStage() || 0))];

        this.setPower(this.getHeatStage() + .4);

        this.data.heat = Math.min(Math.max(this.data.heat, this.maxHeat), 100);
        if (this.engineAnimation.isReadyToGoBack()){
            this.engineAnimation.goBack();
            this.deployEnergyToTarget();
        }
    }

    destroy(){
        this.engineAnimation.destroy();
    }

    getConnectionSide(){
        for(let i = 0; i < 6; i++){
            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            const block = World.getBlock(relCoords.x, relCoords.y, relCoords.z);
            if(EnergyTypeRegistry.isWire(block.id, "RF")){
                return i;
            }
        }
        return 2;
    }

    getHeatStage(){
        return Math.floor(this.data.heat / this.maxHeat * 3);
    }

    updatePower(){// LEGACY
        const change = .04;
        let add = this.data.targetPower - this.data.power;
        if (add > change){
            add = change;
        }
        if (add < -change){
            add = -change;
        }
        this.data.power += add;
    }

    setPower(power){
        this.data.targetPower = power;
    }

    deployEnergyToTarget(){
        // TODO deploy
    }
}