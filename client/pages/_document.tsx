import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript,
} from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);

		return initialProps;
	}

	render() {
		return (
			<Html>
				<Head>
					{/* <title>Readit</title> */}
					<link rel='icon' href='/images/readit.svg' type='image/svg+xml' />
					<meta property='og:site_name' content='readit' />
					{/* <meta property="twitter:site" content="@readit" /> */}
					<meta property='twitter:card' content='summary' />
					<meta property='og:type' content='website' />
					<meta
						property='twitter:image'
						content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/images/readit.svg`}
					/>
					<meta
						property='og:image'
						content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/images/readit.svg`}
					/>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link
						rel='preconnect'
						href='https://fonts.gstatic.com'
						crossOrigin='true'
					/>
					<link
						href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300&family=Indie+Flower&family=Lato:wght@300&display=swap'
						rel='stylesheet'
					/>
					<link
						rel='stylesheet'
						href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'
						integrity='sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=='
						crossOrigin='anonymous'
						referrerPolicy='no-referrer'
					/>
				</Head>
				<body className='font-body bg-slate-200'>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
