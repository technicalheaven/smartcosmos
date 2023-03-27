export default ({ title, code, message }:any) =>
  `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Smart Cosmos Rolling Code Validation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://use.fontawesome.com/acb94035c9.js"></script>
    <style>

        * {
            line-height: 1.2;
            margin: 0;
        }

        html {
            color: #888;
            display: table;
            font-family: sans-serif;
            height: 100%;
            text-align: center;
            width: 100%;
        }

        body {
            display: table-cell;
            vertical-align: middle;
            margin: 2em auto;
        }

        h1 {
            color: #555;
            font-size: 2em;
            font-weight: 400;
            margin-bottom: 15px;
        }

        p {
            margin: 0 auto;
            width: 280px;
        }

        .icon {
            color: red;
            margin-bottom: 15px;
        }

        .head {
            color: red;
            margin-bottom: 15px;
        }

        .subhead {
            font-size: 1.2em;
            width: 350px;
        }

        @media only screen and (max-width: 350px) {

            body, p {
                width: 95%;
            }

            h1 {
                font-size: 1.5em;
                margin: 0 0 0.3em;
            }

        }

    </style>
</head>
<body>
    <div class="icon"><i class="fa fa-times-circle fa-5x" aria-hidden="true"></i></div>
    <h1 class="head">Tag Validation Failed: ${title}</h1>
    <p class="subhead">${message}</p>
</body>
</html>
<!-- IE needs 512+ bytes: https://blogs.msdn.microsoft.com/ieinternals/2010/08/18/friendly-http-error-pages/ -->
`;
