import { OrganizationProfile } from "@clerk/nextjs"

export default function Settings() {
  return (
    <div className="w-full">
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "shadow-none w-full",
            cardBox: "shadow-none w-full border",
            navbar: "bg-white bg-none",
            card: "border border-[#e5e5e5] shadow-none w-full"
          },
        }}
      />
    </div>
  )
}
