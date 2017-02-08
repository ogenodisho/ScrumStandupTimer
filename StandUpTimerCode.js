function padZeros(value) {
    if (value.length === 1) {
        return "0" + value;
    } else {
        return value;
    }
}

// -> Fisher–Yates shuffle algorithm
function shuffleArray(array) {
    var m = array.length,
        t, i;

    // While there remain elements to shuffle
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

class ScrumStandUpTimer extends React.Component {
    componentWillMount() {
        shuffleArray(this.state.teamMembers);
    }

    constructor() {
        super();
        this.state = {
            currentTeamMemberIndex: 0,
            teamMembers: [{
                name: "Aaron",
                imageUrl: "http://www.tfo.su/uploads5/futurama/03.png",
                awaitingTurn: true
            }, {
                name: "Daniel",
                imageUrl: "http://www.tfo.su/uploads5/futurama/16.png",
                awaitingTurn: true
            }, {
                name: "Ian",
                imageUrl: "http://www.tfo.su/uploads5/futurama/41.png",
                awaitingTurn: true
            }, {
                name: "Jason",
                imageUrl: "http://www.tfo.su/uploads5/futurama/14.png",
                awaitingTurn: true
            }, {
                name: "Ogen",
                imageUrl: "http://www.tfo.su/uploads5/futurama/36.png",
                awaitingTurn: true
            }, {
                name: "Robert",
                imageUrl: "http://www.tfo.su/uploads5/futurama/22.png",
                awaitingTurn: true
            }, {
                name: "Tegan",
                imageUrl: "http://www.tfo.su/uploads5/futurama/29.png",
                awaitingTurn: true
            }, {
                name: "Tom",
                imageUrl: "http://www.tfo.su/uploads5/futurama/49.png",
                awaitingTurn: true
            }],
            minuteDuration: "02",
            secondDuration: "00"
        };
    }

    handleTimerSet(minuteDuration, secondDuration) {
        this.setState({
            minuteDuration: minuteDuration,
            secondDuration: secondDuration
        });
    }

    handleTimerFinished(teamMemberIndex) {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.teamMembers[teamMemberIndex].awaitingTurn = false;
        this.setState(stateCopy);
    }

    teamMemberChecked(newTeamMember) {
        var stateCopy = Object.assign({}, this.state);
        for (var i = 0; i < this.state.teamMember.length; i++) {
            if (newTeamMember.name === this.state.teamMember[i].name) {
                stateCopy.teamMembers[i].awaitingTurn = newTeamMember.awaitingTurn;
            }
        }
        this.setState(stateCopy);
    }

    render() {
        const _this = this;
        return ( <
            div >
            <
            Avatar teamMembers = {
                this.state.teamMembers
            }
            /> <
            Timer teamMembers = {
                this.state.teamMembers
            }
            onSet = {
                this.handleTimerSet.bind(this)
            }
            onFinished = {
                this.handleTimerFinished.bind(this)
            }
            minutesLeft = {
                this.state.minuteDuration
            }
            secondsLeft = {
                this.state.secondDuration
            }
            /> <
            div className = "teamMemberListingContainer" > {
                this.state.teamMembers.map(function(teamMember) {
                    return <TeamMemberListing teamMember = {
                        teamMember
                    }
                    teamMemberChanged = {
                        _this.teamMemberChecked
                    }
                    />
                })
            } <
            /div> < /
            div >
        );
    }
}

class Avatar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "Scrum Standup Timer",
            imageUrl: "https://lh3.googleusercontent.com/-v2Z4lxXe6LY/AAAAAAAAAAI/AAAAAAAAAAA/uVDfAq0u28s/photo.jpg"
        }
    }
    componentWillReceiveProps() {
        for (var i = 0; i < this.props.teamMembers.length; i++) {
            if (this.props.teamMembers[i].awaitingTurn) {
                this.setState({
                    name: this.props.teamMembers[i].name,
                    imageUrl: this.props.teamMembers[i].imageUrl
                })
                return;
            }
        }
        this.setState({
            name: "Scrum Standup Timer",
            imageUrl: "https://lh3.googleusercontent.com/-v2Z4lxXe6LY/AAAAAAAAAAI/AAAAAAAAAAA/uVDfAq0u28s/photo.jpg"
        })
    }
    render() {
        return ( <
            div className = "avatar" >
            <
            p > {
                this.state.name
            } < /p> <
            img src = {
                this.state.imageUrl
            } > < /img> < /
            div >
        );
    }
}

class TeamMemberListing extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange(event) {
        this.props.teamMember.awaitingTurn = !this.props.teamMember.awaitingTurn
        this.props.teamMemberChanged(this.props.teamMember)
    };

    render() {
        return ( <
            label className = "teamMemberListing" > {
                this.props.teamMember.name
            } <
            input type = "checkbox"
            checked = {
                this.props.teamMember.awaitingTurn
            }
            onChange = {
                this.onChange.bind(this)
            }
            /> < /
            label >
        );
    }
}

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teamMemberIndex: -1,
            minutesLeft: props.minutesLeft,
            secondsLeft: props.secondsLeft
        }
    }

    componentWillReceiveProps() {
        for (var i = 0; i < this.props.teamMembers.length; i++) {
            if (this.props.teamMembers[i].awaitingTurn) {
                clearInterval(this.state.intervalId) // clear old timer because a new one will start
                this.setState({
                    teamMemberIndex: i,
                    intervalId: setInterval(this.tick.bind(this), 1000)
                })
                break;
            }
        }
    }
    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }
    tick() {
        var minutesLeft = parseInt(this.state.minutesLeft)
        var secondsLeft = parseInt(this.state.secondsLeft)

        if (minutesLeft === 0 && secondsLeft === 0) {
            this.finishTurn();
            return
        }

        if (secondsLeft === 0) {
            minutesLeft -= 1
            secondsLeft = 59
        } else {
            secondsLeft -= 1
        }

        minutesLeft = padZeros(minutesLeft + "")
        secondsLeft = padZeros(secondsLeft + "")

        this.setState({
            minutesLeft: minutesLeft,
            secondsLeft: secondsLeft
        })
    }
    setTimer() {
        this.props.onSet(this.state.minutesLeft, this.state.secondsLeft)
    }
    finishTurn() {
        clearInterval(this.state.intervalId)
        this.props.onFinished(this.state.teamMemberIndex)
        this.setState({
            minutesLeft: this.props.minutesLeft,
            secondsLeft: this.props.secondsLeft
        })
    }
    skip() {
        this.finishTurn();
    }
    handleChange(event) {
        event.target.value = padZeros(event.target.value)
        if (event.target.className === "minutes") {
            this.setState({
                minutesLeft: event.target.value
            })
        } else if (event.target.className === "seconds") {
            this.setState({
                secondsLeft: event.target.value
            })
        }
    }
    render() {
        return ( <
            div >
            <
            TimeInput onChange = {
                this.handleChange.bind(this)
            }
            minutesLeft = {
                this.state.minutesLeft
            }
            secondsLeft = {
                this.state.secondsLeft
            }
            /> <
            div className = "timerButtonsContainer" >
            <
            input type = "button"
            onClick = {
                this.setTimer.bind(this)
            }
            value = "Set Timer/Start" > < /input> <
            input type = "button"
            onClick = {
                this.skip.bind(this)
            }
            value = "Skip" > < /input> < /
            div > <
            /div>
        )
    }
}

class TimeInput extends React.Component {
    constructor(props) {
        super(props)
        this.focusSeconds = this.focusSeconds.bind(this);
        this.blurSeconds = this.blurSeconds.bind(this);
        this.focusMinutes = this.focusMinutes.bind(this);
        this.blurMinutes = this.blurMinutes.bind(this);
    }
    handleKeyPress(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    focusSeconds() {
        this.secondsInput.focus();
    }
    blurSeconds() {
        this.secondsInput.blur();
    }
    focusMinutes() {
        this.minutesInput.focus();
    }
    blurMinutes() {
        this.minutesInput.blur();
    }

    render() {
        return ( <
            div className = "timeInput" >
            <
            input className = "minutes"
            type = "number"
            min = "0"
            max = "59"
            value = {
                this.props.minutesLeft
            }
            onChange = {
                this.props.onChange
            }
            onKeyPress = {
                this.handleKeyPress
            }
            onMouseEnter = {
                this.focusMinutes
            }
            onMouseLeave = {
                this.blurMinutes
            }
            ref = {
                (input) => {
                    this.minutesInput = input;
                }
            }
            /> <
            span >: < /span> <
            input className = "seconds"
            type = "number"
            min = "0"
            max = "59"
            value = {
                this.props.secondsLeft
            }
            onChange = {
                this.props.onChange
            }
            onKeyPress = {
                this.handleKeyPress
            }
            onMouseEnter = {
                this.focusSeconds
            }
            onMouseLeave = {
                this.blurSeconds
            }
            ref = {
                (input) => {
                    this.secondsInput = input;
                }
            }
            /> < /
            div >
        );
    }
}

ReactDOM.render( <
    ScrumStandUpTimer / > ,
    document.getElementById('root')
);
