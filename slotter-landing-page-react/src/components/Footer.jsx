import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-[#070707] text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and company info section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-wider">LOGO</h2>
                        <p className="text-[#d2d2d2] max-w-xs">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <p className="text-[#d2d2d2]">@Lorem</p>
                    </div>

                    {/* Links section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium mb-6">Links</h3>
                        <nav className="flex flex-col space-y-3">
                            <Link href="/privacy-policy" className="text-[#d2d2d2] hover:text-white transition-colors">
                                Privacy policy
                            </Link>
                            <Link href="/cookie-policy" className="text-[#d2d2d2] hover:text-white transition-colors">
                                Cookie policy
                            </Link>
                            <Link href="/terms" className="text-[#d2d2d2] hover:text-white transition-colors">
                                Terms & conditions
                            </Link>
                            <Link href="/contact" className="text-[#d2d2d2] hover:text-white transition-colors">
                                Contact us
                            </Link>
                        </nav>
                    </div>

                    {/* Contact section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium mb-6">Contact us</h3>
                        <p className="text-[#d2d2d2] max-w-xs">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <p className="text-[#d2d2d2]">123456987</p>

                        {/* Social media icons */}
                        <div className="flex space-x-4 mt-6">
                            <Link href="#" className="bg-white rounded-full p-2 text-[#070707] hover:opacity-80 transition-opacity">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="bg-white rounded-full p-2 text-[#070707] hover:opacity-80 transition-opacity">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="bg-white rounded-full p-2 text-[#070707] hover:opacity-80 transition-opacity">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="bg-white rounded-full p-2 text-[#070707] hover:opacity-80 transition-opacity">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright section */}
            <div className="border-t border-[#333333] py-6">
                <div className="container mx-auto px-4">
                    <p className="text-center text-[#d2d2d2] text-sm">Copyright © 2025 All rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}
