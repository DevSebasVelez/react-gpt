
interface Props {
    text: string;
}

export const MyMessage = ({ text }: Props) => {
  return (
    <div className="col-start-2 col-end-13 md:col-end-13 p-3 rounded-lg">
        <div className="flex justify-start flex-row-reverse gap-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-700 flex-shrink-0">
                G
            </div>
            <div className="relative ml-3 text-md bg-indigo-700 bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
                <div>{text}</div>
            </div>
        </div>
    </div>
  )
}

