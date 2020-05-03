class Square extends Component {
    constructor(val, challenge, row, col) {
        super();
        this.val = val;
        this.challenge = challenge;
        this.row = row;
        this.col = col;
    }

    toggleSelect() {
        let toggled = !this.challenge.selected[this.row][this.col];
        this.challenge.selected[this.row][this.col] = toggled;
    }

    isSelected() {
        return this.challenge.selected[this.row][this.col];
    }

    body() {
        let val = this.val;
        return div()
            .class("captcha-square")
            .class(this.isSelected() ? "square-selected" : null)
            .setAttr("style", `background-color: rgb(${val}, ${val}, ${val})`)
            .onClick(() => {
                this.toggleSelect();
                htmless.rerender(this);
            });
    }
}

class GreyChallenge {
    constructor() {
        this.threshold = _.random(64, 255 - 64);
        this.selected = _.range(0, 20).map((row) => {
            return _.range(0, 20).map((col) => {
                return false;
            });
        });
        this.matrix = _.range(0, 20).map((row) => {
            return _.range(0, 20).map((col) => {
                return _.random(0, 255);
            });
        });
    }
    challengeString() {
        return `shades of grey where <code>value >= ${this.threshold}</code>`;
    }
    check() {
        let checkFailed = false;

        _.range(0, 20).map((row) => {
            return _.range(0, 20).map((col) => {
                let selected = this.selected[row][col];
                let shouldBeSelected = this.matrix[row][col] >= this.threshold;
                if (selected !== shouldBeSelected) {
                    checkFailed = true;
                }
            });
        });
        return !checkFailed;
    }
    body() {
        let rows = [];
        for (let row = 0; row < 20; row++) {
            let squares = [];
            for (let col = 0; col < 20; col++) {
                let val = this.matrix[row][col];
                squares.push(new Square(val, this, row, col));
            }
            rows.push(div(...squares).class("squares-row"));
        }
        return div(...rows).class("squares");
    }
}

class UnCaptcha extends Component {
    constructor() {
        super();
        this.completed = false;
        this.showChallenge = false;
        this.challenge = null;
    }

    newChallenge() {
        this.challenge = new GreyChallenge();
    }

    renderBox() {
        return div(
            div()
                .class("checkbox")
                .onClick(() => {
                    this.newChallenge();
                    this.showChallenge = true;
                    htmless.rerender(this);
                }),
            "I'm a robot",
            div(image("assets/logo.png"), "unCAPTCHA").class("logo-box")
        ).class("captcha-box");
    }

    renderChallenge() {
        return div(
            div(
                span("Select all"),
                span(inlineHTML(this.challenge.challengeString())).class(
                    "specification"
                ),
                span("If there are none, click next")
            ).class("challenge-header"),
            this.challenge.body(),
            div(
                hyperlink("privacy").href(
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                ),
                hyperlink("terms").href(
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                ),
                button("Next").onClick(
                    (() => {
                        if (!this.challenge.check()) {
                            console.log("wow u suck");
                            this.newChallenge();
                            htmless.rerender(this);
                        }
                    }).bind(this)
                )
            ).class("challenge-footer")
        ).class("captcha-challenge");
    }

    body() {
        if (this.showChallenge) {
            return this.renderChallenge();
        } else {
            return this.renderBox();
        }
    }
}

let app = div(new UnCaptcha());

document.body.appendChild(app.render());
