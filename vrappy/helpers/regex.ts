export const regexes = {
	youtube:
		/(^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|v\/)?)([\w\-]+)(\S+)?$)/g,
	file_path: /(^.*(?:\\|\/)(?!.*(?:\\|\/))(.*)$)/g,
};
