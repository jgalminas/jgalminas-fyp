import { cn } from "@fyp/class-name-helper";
import { RoleIcons } from "@renderer/util/role";

export const ROLE = ['FILL', 'TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'] as const; // TODO: get this from shared types package
export type Role = typeof ROLE[number];

export type RoleSelectorProps = {
  className?: string,
  role: Role,
  onChange: (role: Role) => void
}

const RoleSelector = ({ className, onChange, role }: RoleSelectorProps) => {

  return (
    <div className={cn("flex items-center text-star-dust-400 divide-x border border-woodsmoke-50 divide-woodsmoke-50 w-fit rounded-lg overflow-hidden",
    className)}>
      { ROLE.map((r) => {
        const Icon = RoleIcons[r];
        return (
          <button key={r} onClick={() => onChange(r)} className={cn("p-1.5 bg-woodsmoke-400", role === r && "bg-woodsmoke-50")}>
            <Icon/>
          </button>
        )
      }) }
    </div>
  )
}

export default RoleSelector;