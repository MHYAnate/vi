"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Props {
	setQNav: (value: string) => void;
	qNav: string;
}

const FooterComponent: React.FC<Props> = ({setQNav, qNav}) => {

	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	useEffect(() => {
		setCurrentYear(new Date().getFullYear());
	}, []);

	return (
		<footer className="bg-white text-black py-12 border-t border-gray-200">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div onClick={()=>setQNav(qNav!=="header"?"header":"")} className="flex items-center mb-8 md:mb-0 group">
						<div className="relative w-12 h-12 mr-3 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
							<Image
								src="/ai.jpg"
								alt="Sspot1 Logo"
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<span className="cursor-pointer text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-[family-name:var(--ProtestGuerrilla)] relative">
            {` Sspot1 Analytic`}
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-600 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
						</span>
					</div>
          <div className="mt-12 text-center">
					<p className="text-sm text-gray-500">
						© {currentYear}{" "}
						<span className="font-[family-name:var(--ProtestGuerrilla)] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
						{`Sspot1 Analytic`}
						</span>{" "}
						by ILUD. All rights reserved.
					</p>
				</div>
				
				</div>
			
			</div>
			<div className="mt-8 flex justify-center space-x-6">
				{["Twitter", "LinkedIn"].map((platform) => (
					<Link
						key={platform}
						href={`https://${platform.toLowerCase()}.com`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-400 hover:text-black transition-colors duration-300"
						aria-label={platform}
					>
						{platform === "Twitter" && (
							<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48">
								<path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
							</svg>
						)}

						{platform === "LinkedIn" && (
							<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<path
									fillRule="evenodd"
									d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</Link>
				))}
			</div>
		</footer>
	);
};

FooterComponent.displayName = "FooterComponent";
export default FooterComponent;
