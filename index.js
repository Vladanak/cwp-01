const fs = require('fs');
const path = require('path');
const myScriptForSummary = require('./new');

const DIR_PATH = process.argv[2];
const EXTENSION = '.txt';
let copyright;

(() =>
{
    fs.access(DIR_PATH, err =>
        {
            if (err)
            {
                console.log(err);
                console.log("Path error");
            }
            else
                {
                let dirPath = createDirForTXT();
                createSummaryScript();
                setCopyright();
                copyTXT(DIR_PATH, dirPath);
                iWantToSeeChanges(DIR_PATH);
            }
        }
    )
})();

const createSummaryScript = () =>
{
    fs.writeFile(`${DIR_PATH}\\summary.js`, myScriptForSummary, err =>
    {
        if (err)
        {
            console.log(err);
            console.log('Error in appending file');
        }
    });
};

const setCopyright = () =>
{
    fs.readFile("config.json", (err, data) =>
    {
        if (err)
        {
            console.log(err);
            console.log("error in config.json");
            copyright = 'null';
        }
        else
            {
            copyright = JSON.parse(data);
        }
    }
    )
};

const createDirForTXT = () =>
{
    let dir = `${DIR_PATH}\\${path.basename(DIR_PATH)}`;
    fs.mkdir(dir, err =>
    {
        if (err)
        {
            console.log(err);
            console.log("error in creatind directory for *.txt files");
            throw  err;
        }
    }
    );
    return dir;
};

const copyTXT = (dir, dirOfTXTFiles) =>
{
    fs.readdir(dir, (err ,files) =>
    {
        if (err)
            console.log(err);
        else
            {
            for(let file in files)
            {
                let currentFile = `${dir}\\${files[file]}`;
                if(fs.statSync(currentFile).isDirectory())
                {
                    copyTXT(currentFile, dirOfTXTFiles);
                }
                else
                    {
                    if (path.extname(currentFile) === EXTENSION)
                    {
                        fs.readFile(currentFile, 'utf8', (err, data) =>
                        {
                            if (err)
                            {
                                console.log(err);
                                console.log(`can't read file ${currentFile}`);
                            }
                            else
                                {
                                addCopyright(dirOfTXTFiles + path.sep + files[file], data);
                            }
                        })
                    }
                }
            }
        }
    })
};

const addCopyright = (path, data) =>
{
    let text = copyright["copyright"] + data + copyright["copyright"];
    fs.appendFile(path, text, 'utf8', err =>
    {
        if (err)
        {
            console.log(err);
            console.log("error in adding copyright");
        }
    })
};

const iWantToSeeChanges = dir =>
{
    fs.watch(dir, (eventType, fileName) =>
    {
        if (fileName)
        {
            console.log(fileName.toString());
        }
    });
};