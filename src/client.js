const DEFAULT_INPUT_TEXT = "Schtroumpf ...";

$(document).ready(() => {
    $("#info-button").on("click", () => {
        customAlert(`
        <h1 class="ui header">Site web créé par <a href="https://www.linkedin.com/in/baptiste-may-8706602a3/">Baptiste May</a></h1>
        <div class="ui icon teal message">
            <i class="certificate icon"></i>
            <div class="content">
                <div class="header">Librairie CSS</div>
                <p><a href="https://semantic-ui.com/">Semantic UI</a></p>
            </div>
        </div>
        <div class="ui icon warning message">
            <i class="exclamation triangle icon"></i>
            <div class="content">
                <div class="header">Vous avez rencontré un problème ?</div>
                <p>N'hésitez pas à me contacter via <a href="mailto:pro@may-baptiste.fr">pro@may-baptiste.fr</a></p>
            </div>
        </div>
        `);
    });

    const searchSmtpf = $("#search-smtpf");
    const searchSubmit = $("#search-submit");

    let lastProps = Cookies.get("last_props");
    if (!lastProps) {
        Cookies.set("last_props", `{"last_finded": 0, "last_updated": 0, "props": []}`);
    }
    lastProps = Cookies.get("last_props");
    let { last_finded, last_updated, props } = JSON.parse(lastProps);
    if (!sameDay(new Date(last_updated), new Date(getNowDate()))) {
        updateCookies(last_finded, []);
        props = [];
    }

    $.get(`/getSchtroumpfs`, async data => {
        for (const d of data) {
            searchSmtpf.append(`<option id="smtpf-${d.id}" value="${d.id}">${d.name} <img src="${d.img}"></option>`);
        }
        if (last_finded < getNowDate()) {
            // Not finded
            for (const id of props) {
                await addProp(data[id]);
            }
            updateMessage(false);
            $(".ui.dropdown").removeClass("disabled");
            searchSubmit.removeClass("disabled");
            searchSubmit.on("click", async () => {
                searchSubmit.transition("pulse");
                const input = $(".ui.dropdown .text");
                input.addClass("default");
                input.text(DEFAULT_INPUT_TEXT);
                const id = parseInt(searchSmtpf.val());
                const finded = await addProp(data[id], false);
                props.push(id);
                if (finded) {
                    last_finded = getNowDate();
                    $(".ui.dropdown").addClass("disabled");
                    searchSubmit.addClass("disabled");
                    updateMessage(true);
                    customAlert(`<h1 class="ui header">
                        <i class="check circle icon"></i>
                        <div class="content">Bravo !</div>
                        <div class="sub header">Vous avez trouvé le Schtroumpf !</div>
                    </h1>
                    <div class="ui blue card">
                        <div class="image">
                            <img src="${data[id].img}">
                        </div>
                        <div class="content">
                            <div class="header">${data[id].name}</div>
                            <div class="meta">${data[id].species}</div>
                        </div>
                        <div class="extra content">Première apparition : ${data[id].first_episode}</div>
                    </div>`);
                }
                updateCookies(last_finded, props);
            });
            setInterval(() => {
                searchSubmit.transition("tada");
            }, 5000);
        } else {
            // Finded
            for (const id of props) {
                await addProp(data[id], true);
            }
            updateMessage(true);
        }
        // Finished loading
        $("#container").removeClass("loading");
    });

    $.get("/getNbFinded", data => {
        const nb = data.nb;
        const message = (() => {
            switch (nb) {
                case 0:
                    return "Personne n'a encore trouvé le Schtroumpf du jour !"
                case 1:
                    return "Une seule personne a trouvé le Schtroumpf du jour !"
                default:
                    return `${nb} personnes ont trouvé le Schtroumpf du jour !`
            }
        })();
        const elt = $("#nb-fined");
        elt.addClass("blue");
        elt.html(`<i class="user icon"></i>` + message);
    });
});

function request(url) {
    return new Promise((resolve, reject) => {
        $.get(url, data => {
            resolve(data);
        }).fail(err => {
            reject(err);
        });
    });
}

function createSpans(smtpf, results) {
    let res = "";
    for (const key of smtpf) {
        res += `<span class="ui ${results[key] ? 'green' : 'red'} label">${key}</span>`;
    }
    return res;
}

function getNowDate() {
    return new Date(new Date().toDateString()).getTime();
}

function updateMessage(type) {
    const message = $("#message");
    if (type) {
        message.removeClass("red");
        message.addClass("green");
        message.html("<i class='check circle icon'></i>Le Schtroumpf du jour a été trouvé !");
    } else {
        message.addClass("red");
        message.html("<i class='exclamation circle icon'></i>Le Schtroumpf du jour n'a pas encore été trouvé.");
    }
}

async function addProp(smtpf, finded) {
    const id = smtpf.id;
    const requestData = await request(`/testSchtroumpfs?id=${id}&finded=${finded}`);
    $(`#smtpf-${id}`).remove();
    $("#table-body").append(`<tr>
        <td><img class="ui mini image" src="${smtpf.img}"></td>
        <td class="${requestData.name ? 'positive' : 'negative'}">${smtpf.name}</td>
        <td class="${requestData.sex ? 'positive' : 'negative'}">${smtpf.sex === 0 ? "Masculin" : "Feminin"}</td>
        <td class="${requestData.species ? 'positive' : 'negative'}">${smtpf.species}</td>
        <td class="${typeof smtpf.ennemies === "string" ? (requestData.ennemies ? "positive" : "negative") : ""}">${typeof smtpf.ennemies === "string" ? smtpf.ennemies : createSpans(smtpf.ennemies, requestData.ennemies)}</td>
        <td>${createSpans(smtpf.looks, requestData.looks)}</td>
        <td class="${requestData.first_episode ? 'positive' : 'negative'}">${smtpf.first_episode}</td>
    </tr>`);
    return requestData.name;
}

function updateCookies(last_finded, props) {
    Cookies.set("last_props", JSON.stringify({last_finded: last_finded, last_updated: getNowDate(), props: props}));
}

function customAlert(html) {
    $("#alert").transition("scale");
    $("#alert-inside").html(html);
}

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}

