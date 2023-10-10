/// <mls shortName="serviceTeste" project="100541" enhancement="_blank" />

class ServiceTeste {

    private _div1: HTMLDivElement;

    private level: mls.events.Level;

    public position: 'left' | 'right';

    private projectActual = 0;

    constructor(el: HTMLDivElement, level: string, position: 'left' | 'right') {
        
        if (el) el['mlsWidget'] = this;
        this._div1 = el;
        this.level = +level as mls.events.Level;
        this.position = position || 'left';
        this._div1 = el;


    }

    public onServiceClick(ev: MouseEvent): void {

        this.onExec();

    }

    // eslint-disable-next-line
    public static details = {
        icon: '&#xf15b',
        name: 'Teste',
        mode: 'A',
        position: 'all',
        readOnly: false,
        tooltip: 'Teste',
        visible: 'A',
        className: '', 
        tags: [] as any   
    }

    
    public onSelectedChange(): void {
        // l4 selectedNode changed
        // only on active service
    }

    public onVariationChange(newV: number, actualV: number): void {
        // L4 variation changed
        // only on active service
    }

    /** event after menu selection
     * @return true if ok
     */
    public onClickLink = (op: string): boolean => {

        if (op === 'opDefault') return this.showDefault();
        if (op === 'opAbout') return this.showAbout();
        if (op === 'opAdd') return this.showAdd();
        if (this.menu.setMode) this.menu.setMode('initial');
        return false;
    }

    public menu = {
        title: (mls.actual[5].project ? mls.actual[5].project.toString() : '0'),
        // breadcrumbs: {
        // opHome: 'Home',
        // opFile: 'ThisFile'
        // },
        actions: {
            opDefault: '',
            opAbout: 'About',
            opAdd: 'Add new file',

            // opTSDeps: 'Typescript - Dependencies',
        },
        actionDefault: 'opDefault', // call after close icon clicked
        setMode: undefined as any, // child will set this
        onClickLink: this.onClickLink,
        updateTitle: undefined as any,
    }

    public openMenu(op: string) {
        const toolbarService = this._div1.querySelector('mls-toolbar-service-100529');
        const checkbox = toolbarService.querySelector('.menu-btn') as HTMLInputElement;
        checkbox.checked = true;
        checkbox.onchange(undefined);
        this.onClickLink(op);
    }

    //
    // ==== implementations 
    //

    private showDefault(): boolean {
        const path = this.c2.getAttribute('path');
        if (path !== '_100529_service_list_files' && path !== '') this.c2.setAttribute('path', '_100529_service_list_files');
        return true;
    }

    private showAdd() {
        if (this.menu.setMode) this.menu.setMode('editor');
        this.c2.setAttribute('path', '_100529_service_list_new_file');
        return true;
    }

    private showAbout(): boolean {

        const div1 = document.createElement('div');
        div1.innerHTML = '<h1>About this Service</h1>'
            + '<h2>Service Name: _100529_service_List</h2>'
            + '<hr>'
            + '<p>Widget Source: https://multilevelstudio.com/#/l2/_100529_service_List</p>'
            + '<p>Page Source: https://multilevelstudio.com/#/l4/_100529_service_List</p>'
            + '<hr>'
            + '<br>';
        if (this.menu.setMode) this.menu.setMode('page', div1);

        return true;
    }

    private onExec() {

        this.loadService();
        return true;

    }

    private myTimeout:number;

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (!this.isServiceVisible()) return;

        if (ev.level !== this.level || (ev.type !== 'FileAction')) return;
        const fileAction = JSON.parse(ev.desc) as mls.events.IFileAction;
        if (fileAction.position === this.position || !['statusOrErrorChanged', 'projectListChanged'].includes(fileAction.action) || fileAction.project === 0) return;

        this.loadService2();

    }

    private loadService2(): void {

        const frame = this._div1.querySelector('iframe') as HTMLIFrameElement;
        if (!frame || !frame.contentDocument || !frame.contentDocument.body['service_list_files']) return;
        frame.contentDocument.body['service_list_files'].changeList(500);

    };

    private isServiceVisible(): boolean {

        const container = this._div1.closest('mls-toolbar-content-100529') as HTMLElement;
        if (!container) return false;
        const serviceName = container.getAttribute('servicename');
        if (serviceName !== this.constructor.name) return false;
        return true;

    }

    private c1: HTMLElement;
    private c2: HTMLElement;

    private loadService(): void {

        if (!this.c1 || !this.c2) {

            this.c1 = document.createElement('mls-toolbar-service-100529');
            this.c2 = document.createElement('mls-load-l4-page-isolate-100529');
            this.c2.setAttribute('path', '_100529_service_list_files');
            this.c2['instance'] = this._div1;
            this._div1.appendChild(this.c1);
            this._div1.appendChild(this.c2);
            this.c2.style.width = '100%';
            this.c2.style.height = '100%';
            this.projectActual = mls.actual[5].project;

        } else {

            this.c2['reload']();

        }

    }
}
