// スプレットシートからcsvを書き出して、そのデータから要素を作成
// まずcsvを配列として扱うにはどうしたら良いか。
// 次に要素ごとに順番に指定の


const input = document.getElementById("csvFile");
const mainElements = document.querySelector('main');
const copyButtonElement = document.getElementById('copyButton');

copyButtonElement.disabled = true;

input.addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log(file);
    
    copyButtonElement.disabled = false;
    copyButtonElement.textContent = "copy!";

    const reader = new FileReader();

    reader.onload = function (event) {
        const csvText = event.target.result;
        const lines = csvText
            .split(/\r?\n/)
            .filter(line => line.trim() !== '');


        const header = lines[0];
        const rows = lines.slice(1);

        const schema = {
            divider: [],

            skipbutton: ['text', 'id', 'label', 'mobile_label'],

            "img-button": ['targetId', 'label'],

            p: ["text", "class"],
            h1: ["text", "class"],
            h2: ["text", "class"],
            a: ["text", "class", "link"]
        };

        const result = rows.map((row) => {
            const cols = row.split(",");
            const type = cols[0];

            const fields = schema[type];

            if(!fields) return "";

            let obj = {type};

            fields.forEach((key, index) => {
                let value = cols[index + 1];

                if (!value) return;

                if(key === 'class') {
                    obj.class = value
                    .split("|")
                    .map(v => v.trim())
                    .filter(v => v !== "");
                } else {
                    obj[key] = value;
                }
            });

            let line = `{type: "${obj.type}"`;

            Object.keys(obj).forEach(key => {
                if (key === "type") return;

                if (key === "class"){
                    line += `, class: [${obj.class.map(c => `"${c}"`).join(",")}]`;
                } else if (key === "text") {
                    line += `, text: \`${obj.text}\``;
                } else {
                    line += `, ${key}: "${obj[key]}"`;
                }

            });

            line += "},";
            return line;
        });



        
        
        mainElements.innerHTML = "";

        result.forEach(value => {
            const pElement = document.createElement('p');
            pElement.textContent = value;
            mainElements.appendChild(pElement);


        });

        


    };

    
    copyButtonElement.addEventListener('click', () => {
            const pElements = mainElements.querySelectorAll('p');

            const copyText = Array.from(pElements)
                .map(p => p.textContent)
                .join('\n');

            navigator.clipboard.writeText(copyText).then(() => {
                console.log('colied!')
                copyButtonElement.textContent = "copied!";
            });
        });

    reader.readAsText(file);


});

