const fs = require('fs');

var dir_path = process.argv[2];


function FileSystem(path,fd)
{
    if(fs.existsSync(path))
    {
        fs.writeFile(`${path}` + "summary.js", "", function (err)
        {
            if (err)
            {
                throw err;
            }

        });
    }
}
