/// <reference path="ObsidianPipeTargetConnector.ts" />
/// <reference path="ObsidianPipeItemEjector.ts" />
/// <reference path="ObsidianPipeItemAccelerator.ts" />
class ObsidianPipeTileEntity implements TileEntity.TileEntityPrototype {
    constructor(protected pipeConnector: PipeConnector) { }

    // * it will be rewriten during runtime
    protected data: any = {}

    public defaultValues: any = {// * it will be rewriten during runtime
        connectionSide: null,
        energy: 0
    }

    public x: number;
    public y: number;
    public z: number;

    public blockSource: BlockSource;

    private targetConnector: ObsidianPipeTargetConnector;
    private ejector: ObsidianPipeItemEjector;
    private accelerator: ObsidianPipeItemAccelerator;

    // !TileEntity event
    public init(): void {
        const pipe = PipeIdMap.getClassById(this.blockSource.getBlockId(this.x, this.y, this.z));
        this.targetConnector = new ObsidianPipeTargetConnector(this.blockSource, this, this.pipeConnector);
        this.ejector = new ObsidianPipeItemEjector(this.blockSource, this);
        this.accelerator = new ObsidianPipeItemAccelerator(this.blockSource, this);
        this.updateConnection();
    }

    // !TileEntity event
    public tick(): void {
        if ((this.ejector && this.data.connectionSide !== null)) {
            this.ejector.collectEntities(this.maxEntitiesToCollect());
            this.accelerator.accelerate(this.maxEntitiesToPull());
        }
        this.data.energy = 0;
    }

    // !TileEntity event
    public destroy() {
        this.ejector = null;
    }

    // !EnergyNet event
    public energyReceive(type, amount, voltage): number {
        const storage = this.getMaxEnergyStored();
        const readyToReceive = Math.min(storage - amount, this.getMaxEnergyReceive());
        const received = Math.min(readyToReceive, amount);
        this.data.energy += received;
        return received;
    }

    public updateConnection(): void {
        this.data.connectionSide = this.targetConnector.getTargetSide();
        this.ejector.ConnectionSide = this.data.connectionSide;
        this.accelerator.ConnectionSide = this.data.connectionSide;
    }

    private maxEntitiesToCollect(): number {
        return 64;
    }

    private maxEntitiesToPull(): number {
        return Math.floor(this.data.energy / 10);
    }

    public canConnectRedstoneEngine(): boolean {
        return true
    }

    public getMaxEnergyStored(): number {
        return 2560;
    }

    public getMaxEnergyReceive(): number {
        return 640;
    }
}