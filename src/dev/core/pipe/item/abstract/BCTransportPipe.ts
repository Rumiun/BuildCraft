/// <reference path="../../abstract/BCPipe.ts" />
/// <reference path="../../abstract/PipeConnector.ts" />
abstract class BCTransportPipe extends BCPipe {
    public get pipeConnector(): PipeConnector {
        if (!this.connector) this.connector = new TransportPipeConnector();
        return this.connector;
    }

    public get renderGroups(): RenderGroups {
        return {
            main: ICRender.getGroup("BCTransportPipe")
        };
    }

    public get transportType(): string {
        return "item"
    }
}