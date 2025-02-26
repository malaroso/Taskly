export const getStatusColor = (status: string) => {
    switch (status) {
        case 'in_progress':
            return '#4ECDC4';  // Turkuaz
        case 'completed':
            return '#59CD90';  // Yeşil
        case 'pending':
            return '#FFB01F';  // Turuncu
        default:
            return '#FF6B6B';  // Kırmızı
    }
};

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'low':
            return '#4ECDC4';  // Turkuaz
        case 'medium':
            return '#FFB01F';  // Turuncu
        case 'high':
            return '#FF6B6B';  // Kırmızı
        default:
            return '#666';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'in_progress':
            return 'In Progress';
        case 'completed':
            return 'Completed';
        case 'pending':
            return 'Pending';
        default:
            return status;
    }
};

export const getPriorityText = (priority: string) => {
    switch (priority) {
        case 'low':
            return 'Low';
        case 'medium':
            return 'Medium';
        case 'high':
            return 'High';
        default:
            return priority;
    }
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const isImageFile = (filePath: string) => {
    if (filePath.includes('encrypted-tbn0.gstatic.com')) {
        return true;
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
}; 