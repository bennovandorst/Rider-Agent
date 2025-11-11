import axios from "axios";
import {logPanel} from "../utils/logger.js";
import chalk from "chalk";

export class PanelService {
    constructor(panelUrl, panelSecret) {
        this.panelUrl = panelUrl;
        this.panelSecret = panelSecret;
    }

    async panelInfo() {
        try {
            const response = await axios.get(`${process.env.PANEL_URL}/v1/api/info`);
            return response.data;
        } catch (error) {
            const status = error.response?.status || 'N/A';
            const message = error.response?.data?.message || error.response?.statusText || error.message || 'Unknown error';
            logPanel(chalk.yellowBright(`Failed to fetch panel info [${status}]: ${message}`));
        }}cl

    async verifyPanelConnection(simrigId) {
        try {
            await axios.get(`${process.env.PANEL_URL}/v1/api/simrig/${simrigId}/access`, {
                headers: {
                    'x-secret-key': process.env.PANEL_SECRET
                },
            });
            const info = await this.panelInfo();
            logPanel(`Successfully connected to Rider Panel - v${info.version}@${info.branch}`);
            return true;
        } catch (error) {
            const status = error.response?.status || 'N/A';
            const message = error.response?.data?.message || error.response?.statusText || error.message || 'Unknown error';
            logPanel(chalk.redBright(`Failed to connect to Rider Panel [${status}]: ${message}`));
            return false;
        }
    }

    async sendStatusUpdate(simrigId, data) {
        try {
            await axios.post(`${process.env.PANEL_URL}/v1/api/simrig/${simrigId}/status`, data, {
                headers: {
                    'x-secret-key': process.env.PANEL_SECRET
                }
            });
        } catch (error) {
            const status = error.response?.status || 'N/A';
            const message = error.response?.data?.message || error.response?.statusText || error.message || 'Unknown error';
            logPanel(chalk.redBright(`Failed to send status update [${status}]: ${message}`));
        }
    }
}
