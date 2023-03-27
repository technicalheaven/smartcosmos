
export default (data:any) =>
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
            font-size: 2em;
            font-weight: 400;
        }

        h2 {
            font-size: 1.2em;
            font-weight: 400;
        }

        p {
            width: 280px;
        }

        .container {
            display: flex;
            flex-direction: column;
            margin: 0px auto;
        }

        .tag {
            margin-bottom: 1px;
        }

        .icon {
          color: green;
          margin-bottom: 15px;
        }

        .head {
          color: green;
          margin-bottom: 15px;
        }

        .subhead {
          margin-bottom: 25px;
        }

        .title {
          font-weight: 600
        }

        @media only screen and (max-width: 280px) {

            body, p {
                width: 95%;
                margin: 0px auto;
            }

            .container {
                margin: 0px auto;
            }

            h1, h2 {
                font-size: 1.5em;
                margin: 0 0 0.3em;
            }

        }

    </style>
</head>
<body>
    <div class="container">
      <div class="icon"><i class="fa fa-check-circle fa-5x" aria-hidden="true"></i></div>
      <h1 class="head">Valid Tag</h1>
      <h2 class="subhead">${data.message}</h2>
      <div class="tag">
        <span class="title">Tag ID: </span><span>${data.tagId}</span>
      </div>
    </div>
</body>
</html>
`;
