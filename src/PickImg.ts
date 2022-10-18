import * as vscode from 'vscode';
import * as os from 'os';

import { FileDom } from './FileDom';

export class PickImg {
    public static pickImg: PickImg | undefined;

    private img: string = '../resources/genshin.jpg';

    // 当前配置
	private config: vscode.WorkspaceConfiguration;

    // 当前配置的背景图路径
    private imgPath: string;

    // 当前配置的背景图透明度
    private opacity: number = 0.2;

    // 图片类型：1：本地文件，2：https
    private imageFileType: number;

    // 当前系统标识
    private osType: number;

    private constructor(
        config: vscode.WorkspaceConfiguration
    ) {
        this.config = config;
        this.imgPath = config.imagePath;
        this.opacity = config.opacity;
        this.imageFileType = 1;
        
        switch (os.type()) {
            case 'Windows_NT':
                this.osType = 1;
                break;
            case 'Darwin':
                this.osType = 2;
                break;
            case 'Linux':
                this.osType = 3;
                break;
            default:
                this.osType = 1;
                break;
        }
    }

    /**
     * 自动更新背景
     */
    public static autoUpdateBackground() {
        let config = vscode.workspace.getConfiguration("backgroundCover")
        if (!config.imagePath) {
            PickImg.pickImg = new PickImg(config);
            PickImg.pickImg.autoUpdateBackground();
        }
        return true;
    }
    
    /**
     * 启动时自动更新
     */
    private autoUpdateBackground() {
        this.setConfigValue('opacity', 0.7, false);
        return this.setConfigValue('imagePath', this.img);
    }

    /**
     * 停用背景
     */
    public static stopBackground() {
        let config = vscode.workspace.getConfiguration('backgroundCover')
        PickImg.pickImg = new PickImg(config)
        PickImg.pickImg.stopBackground();
        return true;
    }

    // 停用背景
    private stopBackground() {
        this.imgPath = ''
        this.updateDom(true);
    }

    private setConfigValue(name: string, value: any, updateDom: Boolean = true) {
        // 更新变量
		this.config.update(name, value, vscode.ConfigurationTarget.Global);
		switch (name) {
			case 'imagePath':
				this.imgPath = value;
				break;
			default:
				break;
		}
		// 是否需要更新Dom
		if (updateDom) {
			this.updateDom();
		}
		return true;
    }

    private updateDom(uninstall: boolean = false) {
        let dom: FileDom = new FileDom(this.imgPath, this.opacity);
        let result = false;
        if (uninstall) {
            this.config.update('imagePath', null, vscode.ConfigurationTarget.Global);
            this.config.update('opacity', null, vscode.ConfigurationTarget.Global);
            result = dom.uninstall();
        } else {
            // 是否需要转base64
            if (this.imageFileType == 1) {
                dom.imageToBase64();
            }
            if (this.osType === 1) {
                result = dom.install()
            } else if (this.osType === 2) {
                result = dom.installMac();
            } else if (this.osType === 3) {
                result = dom.install(); // 暂未做对应处理
            }
        }
        console.log(result);
        vscode.commands.executeCommand(
            'workbench.action.reloadWindow'
        ); // 重新加载窗口，使设置生效
    }
}