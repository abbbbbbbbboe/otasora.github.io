// スプレットシートからcsvを書き出して、そのデータから要素を作成
// まずcsvを配列として扱うにはどうしたら良いか。
// 次に要素ごとに順番に指定の


const input = document.getElementById("csvFile");

input.addEventListener('change', function (event) {
    const file = event.target.files[0];
    console.log(file);

    const reader = new FileReader();

    reader.onload = function (event) {
        const csvText = event.target.result;
        const lines = csvText
            .split(/\r?\n/)
            .filter(line => line.trim() !== '');


        const header = lines[0];
        const rows = lines.slice(1);

        

        const result = rows.map((row) => {
            const cols = row.split(",");

            const type = cols[0];
            
            let line;

            if (type === 'divider') {
            line = `{type:"${type}"},`;
            return line;
            }

            if (type === 'skipbutton') {
                const text =cols[1];
                const id =cols[2];
                const label =cols[3];
                const mobileLavel =cols[4];
                line = `{ type: "${type}", id: "${id}", label: "${label}", mobile_label: "${mobileLavel}", text: "${text}" },`
                return line;

            }

            if (type === 'img-button') {
                const targetId =cols[1];
                const label =cols[2];
                line = `{ type: "${type}", targetId: "${targetId}", label: "${label}"},`
                return line;
            }


            const text = cols[1];
            const className = cols[2];

            const obj = {
                type: type,
                text: text,
            };

            if (className && className.trim() !== "") {
                obj.class = className
                    .split("|")
                    .map(c => c.trim())
                    .filter(c => c !== "");
            }
            
            if (obj.type === 'a'){
                const hyperlink = cols[3];
                line = `{type:"${obj.type}", text:\`${obj.text}\`, link: "${hyperlink}",`;
            } else{
                line = `{type:"${obj.type}", text:\`${obj.text}\`,`;
            }
          
            if (obj.class) {
                line += ` class: [${obj.class.map(c => `"${c}"`).join(",")}]`
            }

            line += "},";
            return line;
        });



        const mainElements = document.querySelector('main');
        const copyButtonElement = document.getElementById('copyButton');

        result.forEach(value => {
            const pElement = document.createElement('p');
            pElement.textContent = value;
            mainElements.appendChild(pElement);


        });

        copyButtonElement.addEventListener('click', () => {
            const pElements = mainElements.querySelectorAll('p');

            const copyText = Array.from(pElements)
                .map(p => p.textContent)
                .join('\n');

            navigator.clipboard.writeText(copyText).then(() => {
                console.log('colied!')
            });
        });


    };

    reader.readAsText(file);


});

