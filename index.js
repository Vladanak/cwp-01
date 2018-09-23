task05();

function task05()
{
    const pathToFile = process.argv[2] + "/summary.js";
    const path = require('path');
    const fs = require('fs');
    if (process.argv[2])
    {
        fs.writeFile(path.basename(pathToFile), "", function(err) {
            if (err)
            {
                throw "Ошибка:\n" + err;
            }
        });
        //task 05.2
        showDirectoryInfo(path.dirname(pathToFile));

        //task 05.3
        let pathToNewDir = path.dirname(pathToFile) + "\\" + path.basename(path.dirname(pathToFile));

        fs.mkdir(pathToNewDir, (err) =>
        {
            if (err)
            {
                throw "Ошибка:\n" + err;
            }
        });

        let files = fs.readdirSync(path.dirname(pathToFile));
        let copyright = JSON.parse(fs.readFileSync('config.json')).copyright;
        for (let i in files)
        {
            if (path.extname(files[i]) === ".txt")
            {
                let pathToSrc = path.dirname(pathToFile) + "\\" + files[i];
                let pathToNewFile = pathToNewDir + "\\" + files[i];

                fs.copyFileSync(pathToSrc, pathToNewFile);
                let fcontent = fs.readFileSync(pathToNewFile, "utf-8");

                let fileContent = copyright + "\r\n" + fcontent + "\r\n" + copyright;
                console.log("file content:\n" + fileContent + "\n");
                fs.writeFile(pathToNewFile, fileContent, (err) =>
                {
                    if (err)
                    {
                        throw "Ошибка:\n" + err;
                    }
                });
                fs.watch(pathToNewFile, (eventType, filename) =>
                {
                    console.log(`Тип события: ${eventType}`);
                    if (filename)
                    {
                        console.log(`Имя файла: ${filename}`);
                    }
                    else
                    {
                        console.log('Файл отсутствует');
                    }
                });

            }
        }

        console.log("All is done.");
    }
    else
    {
        console.log("Error: not valid path to directory.");
    }

    function showDirectoryInfo(pathToDir)
    {
        console.log(pathToDir);
        fs.readdir(pathToDir, function(err, listOfContents)
        {
            if (err)
            {
                console.log(err);
                console.log(pathToDir);
            }
            listOfContents.forEach(element =>
            {
                fs.stat((pathToDir + "\\" + element), function(err, stats)
                {
                    if (err)
                    {
                        console.log(err);
                        console.log(pathToDir);
                    }
                    if (stats.isDirectory())
                    {
                        showDirectoryInfo(pathToDir + "\\" + element);
                    }
                    if (stats.isFile())
                    {
                        fs.appendFileSync(pathToFile, "console.log('" + path.relative(path.dirname(pathToFile), pathToDir + element).toString().replace("\\", "\\\\")  + "');\n");
                    }
                });
            });
        })
    }
}