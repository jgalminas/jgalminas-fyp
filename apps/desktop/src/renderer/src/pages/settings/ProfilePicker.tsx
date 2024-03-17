import { cn } from "@fyp/class-name-helper"
import { REGIONS } from "@fyp/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSummoner } from "@renderer/SummonerContext"
import { updateSummoner } from "@renderer/api/user"
import Button from "@renderer/core/Button"
import Input from "@renderer/core/Input"
import RoundImage from "@renderer/core/RoundImage"
import Select, { SelectOption } from "@renderer/core/Select"
import ErrorMessage from "@renderer/core/message/ErrorMessage"
import Divider from "@renderer/core/page/Divider"
import Modal from "@renderer/core/video/Modal"
import { Asset } from "@renderer/util/asset"
import { useMutation } from "@tanstack/react-query"
import { Fragment, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"


export type ProfilePickerProps = {
  className?: string
}

export const ProfilePicker = ({ className }: ProfilePickerProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);
  const { summoner } = useSummoner();

  return (
    <div className={cn(
      "bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "focus:outline-none text-sm p-2 min-w-[8rem] w-fit gap-1.5 rounded-lg",
      className
    )}>
      { summoner
        ?
        <Fragment>
          <RoundImage className="border-none outline outline-woodsmoke-50" src={Asset.profileIcon(summoner.profileIconId)}/>
          <div className="mr-6 ml-1.5 flex items-center gap-1">
            <div className="truncate max-w-24">
              <span className="text-star-dust-300 font-medium "> { summoner.name } </span>
            </div>
            <span className="text-star-dust-400 text-xs"> #{ summoner.tag } </span>
          </div>
        </Fragment>
        : <span className="mr-6"> Click to set your profile </span>
      }
      <div className="w-[1px] bg-woodsmoke-50 h-8 ml-auto"/>
      <button onClick={() => setOpen(true)} className="text-xs px-1.5 py-2.5 hover:bg-woodsmoke-600 rounded-md"> Change </button>
      { isOpen && <ProfilePickerModal onClose={() => setOpen(false)}/> }
    </div>
  )
}

type ProfilePickerModalProps = {
  onClose: () => void
}

const schema = z.object({
  username: z.string().min(1, "Summoner name is required"),
  region: z.number()
});

type SchemaType = z.infer<typeof schema>;

const ProfilePickerModal = ({ onClose } : ProfilePickerModalProps) => {

  const options: SelectOption[] = REGIONS.map((r, i) => ({
    id: i,
    value: r,
    onClick: () => setValue("region", i)
  }))

  const { summoner, setSummoner } = useSummoner();

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      region: summoner ? REGIONS.findIndex(r => summoner.region === r) ?? 0 : 0,
      username: summoner ? summoner?.name + '#' + summoner?.tag : ""
    }
  });


  const { mutateAsync, data, isPending } = useMutation({
    mutationKey: ["summoner"],
    mutationFn:  updateSummoner
  });

  const onSubmit = handleSubmit(async(form) => {

    const [name, tag] = form.username.split('#');
    const result = await mutateAsync({ name, tag, region: REGIONS[form.region] });

    if (result.status === "success") {
      setSummoner(result.summoner);
      onClose();
    }

  });


  return (
    <Modal clickOutside={false} onClose={onClose} className="w-fit h-fit p-6 rounded-lg">

      <h1 className=" text-star-dust-200 font-medium text-xl">
        Set Summoner Profile
      </h1>

      <Divider className="my-4"/>

      <form onSubmit={onSubmit} className="flex flex-col w-80 gap-5">
        <Input
        label="Summoner Name"
        placeholder="summoner#tag"
        error={errors.username?.message}
        {...register("username", { required: true })}/>

        <Controller
        name="region"
        defaultValue={0}
        control={control}
        render={
          ({ field }) => (
            <Select
            className="w-full"
            menuClass="w-full"
            options={options}
            value={options[field.value]}
            label="Region"
            name="RegionSelect"/>
          )
        }
        />

        { data?.status === "error" &&
          <ErrorMessage>
            { data.message }
          </ErrorMessage>
        }

        <div className="flex gap-2 justify-end mt-4">
          <Button isLoading={isPending} type="submit">
            Confirm
          </Button>
          <Button onClick={onClose} styleType="text" className="hover:bg-woodsmoke-400">
            Cancel
          </Button>
        </div>

      </form>
    </Modal>
  )
}
