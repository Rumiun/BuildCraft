/// <reference path="../PowerMode.ts" />
/// <reference path="../EngineHeat.ts" />

class BCWoodEngineTileEntity extends BCEngineTileEntity {
    private hasSent: boolean = false;

    constructor(protected texture: EngineTexture) {
        super(texture);
        this.client.getEngineTexture = (stage: EngineHeat) => {
            return EngineTextures.wood;
        };
        this.client.getTrunkTexture = (stage: EngineHeat, progress: number) => {
            return stage == EngineHeat.RED && progress < 0.5 ? EngineHeat.ORANGE : stage;
        }
        this.client.getPistonSpeed = (energyStage: EngineHeat) => {
            switch (energyStage) {
                case EngineHeat.GREEN:
                    return 0.02;
                case EngineHeat.ORANGE:
                    return 0.04;
                case EngineHeat.RED:
                    return 0.08;
                default:
                    return 0.01;
            }
        }
    }

    protected computeEnergyStage(): EngineHeat {
        const energyLevel = this.getEnergyLevel();
        if (energyLevel < 0.33) {
            return EngineHeat.BLUE;
        } else if (energyLevel < 0.66) {
            return EngineHeat.GREEN;
        } else if (energyLevel < 0.75) {
            return EngineHeat.ORANGE;
        }
        return EngineHeat.RED;
    }

    public getPistonSpeed(): number {
        return Math.max(0.08 * this.getHeatLevel(), 0.01);
    }

    public engineUpdate(): void {
        super.engineUpdate();
        if (this.isRedstonePowered && World.getThreadTime() % 16 == 0) {
            this.addEnergy(10);
        }
    }

    protected sendPower(): void {
        if (this.progressPart == 2 && !this.hasSent) {
            this.hasSent = true;

            const tile = this.getEnergyProvider(this.getOrientation());

            if (tile && tile.canReceiveEnergy(World.getInverseBlockSide(this.getOrientation()), "RF") &&
                tile.canConnectRedstoneEngine && tile.canConnectRedstoneEngine()) {
                super.sendPower();
            } else {
                this.data.energy = 0;
            }
        } else if (this.progressPart != 2) {
            this.hasSent = false;
        }
    }

    public isBurning(): boolean {
        return this.isRedstonePowered;
    }

    public getCurrentOutputLimit(): number {
        return 10;
    }

    public getMaxEnergy(): number {
        return 1000;
    }

    public getIdealOutput(): number {
        return 10;
    }

    public canConnectEnergy(from: number): boolean {
        return false;
    }

    public getEnergyStored(): number {
        return 0;
    }

    public getMaxEnergyStored(): number {
        return 0;
    }
}