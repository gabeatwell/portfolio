<div class="loading-container">
    <div class="loading-text">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
    </div>

    <div class="loading-line"></div>
</div>

<style>
    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-inline-size: 520px;
        text-align: center;
        color: var(--off-white);
        position: relative;
        margin: 0 32px;

        & .loading-text {
            font-family: var(--ultra);
            font-size: 5vw;
            line-height: 64px;
            letter-spacing: 10px;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-evenly;
            position: relative;

            & span {
                color: var(--clr-gray-700);
                animation: moveLetters 2.5s infinite ease-out;
                transform: translateX(0);
                position: relative;
                display: inline-block;
                opacity: 0;
                text-shadow: 0px 2px 10px rgba(46, 74, 81, 0.3);
                animation-delay: calc(sibling-index() * 0.1s);
            }
        }

        & .loading-line {
            content: '';
            position: absolute;
            width: 0%;
            height: 6px;
            background-color: var(--clr-gray-700);
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 10px;
            animation: moveLine 2s infinite linear;
        }
    }

    @keyframes moveLetters {
        0% {
            transform: translateX(-15vw);
            opacity: 0;
        }

        33.3%,
        66% {
            transform: translateX(0);
            opacity: 1;
        }

        100% {
            transform: translateX(15vw);
            opacity: 0;
        }
    }

    @keyframes moveLine {
        0% {
            width: 0;
        }
        50% {
            width: 80%;
        }
        100% {
            width: 0;
        }
    }
</style>
