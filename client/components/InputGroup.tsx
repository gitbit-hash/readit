interface InputGroupProps {
	className?: string;
	type: string;
	placeholder: string;
	value: string;
	error: string | undefined;
	setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
	className,
	type,
	placeholder,
	value,
	error,
	setValue,
	name,
}) => {
	return (
		<div className={className}>
			<input
				type={type}
				className={`w-full px-3 py-2 transition border ${
					error ? 'border-red-500' : 'border-gray-300'
				} rounded outline-none bg-gray-50 placeholder:uppercase focus:bg-white hover:bg-white 200`}
				placeholder={placeholder}
				value={value}
				onChange={setValue}
				name={name}
			/>
			<small className='font-medium text-red-500'>{error}</small>
		</div>
	);
};

export default InputGroup;
