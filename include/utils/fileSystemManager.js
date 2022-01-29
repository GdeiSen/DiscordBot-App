const fs = require("fs");
const config = require("../../config.json");
module.exports.FileSystemManager = class FileSystemManager {

    constructor() {
        this.requests_file_path = config.REQUESTS_DATA_FILE_PATH;
        this.params_file_path = config.PARAMS_DATA_FILE_PATH;
    }

    /**
     * Creating default files
     */
    createDefFiles = async () => {
        if (await this.#testFileAvailability(this.requests_file_path) == false) this.#createStatiscitsFile();;
        if (await this.#testFileAvailability(this.params_file_path) == false) this.#createParamsFile();
    }

    /**
     * Read File from current file system.
     *
     * @param  {file_name} - File name (requests,params)
     * @param  {state} - State to read
     * @return {string} Returns state value
     */
    readState = async (file_name, state) => {
        let currentFilePath;
        switch (file_name) {
            case 'requests': currentFilePath = this.requests_file_path; break;
            case 'params': currentFilePath = this.params_file_path; break;
            default: break;
        }
        let promise = new Promise((resolve, reject) => {
            fs.readFile(currentFilePath, 'utf8', (err, data) => {
                for (let index = 0; index < data.split('\n').length; index++) {
                    let _state = data.split('\n')[index].split(':')[0];
                    let value = data.split('\n')[index].split(':')[1].replace(/\s/g, '');
                    if (_state == state) resolve(value)
                    if (index == data.split('\n').length - 1) reject(`${state} cannot be found in the ${currentFilePath}`)
                }
            })
        })
        return await promise
    }

    writeState = async (file_name, state, value) => {
        let currentFilePath;
        switch (file_name) {
            case 'requests': currentFilePath = this.requests_file_path; break;
            case 'params': currentFilePath = this.params_file_path; break;
            default: break;
        }
        let promise = new Promise((resolve, reject) => {
            fs.readFile(currentFilePath, "utf-8", function (err, data) {
                var re = RegExp(`${state}.\\s\\d*`);
                data = data.replace(re, `${state}: ${value}`);
                if (!data) reject(`${state} cannot be found in the ${currentFilePath}`)
                resolve(data);
            })
        })
        fs.writeFile(currentFilePath, await promise, (err, data) => { });
        return await promise;
    }

    setValue = async (file_name, state, number) => {
        if (number) { this.writeState(file_name, state, number) }
        else {
            let bufer = await this.readState(file_name, state);
            bufer++;
            await this.writeState(file_name, state, bufer);
        }
    }

    #createStatiscitsFile = () => {
        fs.appendFile(
            this.requests_file_path
        );
    }

    #createParamsFile = () => {
        fs.appendFile(
            this.params_file_path
        );
    }

    #testFileAvailability = async (file_path) => {
        let promise = new Promise((resolve, reject) => {
            fs.access(file_path, function (error) {
                if (error) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            });
        })
        return await promise;
    }
}