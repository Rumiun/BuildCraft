/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="IronPipeTileEntity.ts" />
class PipeIron extends BCTransportPipe {
    constructor() {
        super();
        TileEntity.registerPrototype(this.block.id,
            new IronPipeTileEntity(this.pipeRenderer, this.connector, this.texture)
        );
        Block.registerNeighbourChangeFunctionForID(this.block.id, (coords, block, changeCoords, region: BlockSource) => {
            const tile = World.getTileEntity(coords.x, coords.y, coords.z, region);
            if (tile && TileEntity.isTileEntityLoaded(tile)) {
                tile.checkConnection();
            }
        }
        );
    }

    public get material(): string {
        return "iron"
    }

    protected get pipeTexture(): PipeTexture {
        const textre = `pipe_${this.transportType}_${this.material}`;
        if (!this.texture) {
            this.texture = new PipeTexture(
                { name: textre, data: 0 },
                { name: textre, data: 1 },
                { name: textre, data: 2 }
            );
        }
        return this.texture;
    }

    protected getIngredientForRecipe(): ItemInstance {
        return { id: VanillaItemID.iron_ingot, count: 1, data: 0 }
    }
}
const ironPipe = new PipeIron();