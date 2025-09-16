import * as React from "react";
import {
  FaGithub,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaMedium,
  FaWhatsapp,
} from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import { TbCopy } from "react-icons/tb";
import { PiShareFatBold } from "react-icons/pi";
import { FiArrowRight } from "react-icons/fi";

export const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => <FaGithub size={20} aria-hidden="true" {...props} />;
export const IconTwitter = (props: React.SVGProps<SVGSVGElement>) => <FaXTwitter size={20} aria-hidden="true" {...props} />;
export const IconLinkedIn = (props: React.SVGProps<SVGSVGElement>) => <FaLinkedin size={20} aria-hidden="true" {...props} />;
export const IconMail = (props: React.SVGProps<SVGSVGElement>) => <HiOutlineMail size={20} aria-hidden="true" {...props} />;
export const IconExternal = (props: React.SVGProps<SVGSVGElement>) => <LuExternalLink size={20} aria-hidden="true" {...props} />;
export const IconInstagram = (props: React.SVGProps<SVGSVGElement>) => <FaInstagram size={20} aria-hidden="true" {...props} />;
export const IconMedium = (props: React.SVGProps<SVGSVGElement>) => <FaMedium size={20} aria-hidden="true" {...props} />;
export const IconWhatsApp = (props: React.SVGProps<SVGSVGElement>) => <FaWhatsapp size={20} aria-hidden="true" {...props} />;

export const IconCopy = (props: React.SVGProps<SVGSVGElement>) => <TbCopy size={18} aria-hidden="true" {...props} />;
export const IconShare = (props: React.SVGProps<SVGSVGElement>) => <PiShareFatBold size={18} aria-hidden="true" {...props} />;
export const IconArrow = (props: React.SVGProps<SVGSVGElement>) => <FiArrowRight size={18} aria-hidden="true" {...props} />;
