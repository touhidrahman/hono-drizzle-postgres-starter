# Gunakan base image Bun
FROM oven/bun:latest

# Set working directory di dalam container
WORKDIR /app

# Copy package files terlebih dahulu untuk optimalisasi layer caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile --force

# Copy semua file source code
COPY . .

# Expose port
EXPOSE 3000

# Run application
CMD ["bun", "run", "dev"]